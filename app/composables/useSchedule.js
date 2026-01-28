import { databases, Query } from '~/utils/appwrite'

const DB_ID = 'academia_db'

/**
 * Smart Schedule Composable
 * 
 * Automatically generates a personalized learning schedule based on:
 * - Student's program start date (from application approval)
 * - Course content organized by week
 * - Exam schedules and deadlines
 * - Live session times
 * - Student's progress (completed exams, downloaded materials)
 * 
 * ZERO admin effort - everything is derived from existing data!
 */
export const useSchedule = () => {
  // State
  const loading = ref(false)
  const error = ref('')
  
  // Data
  const programStartDate = ref(null)
  const currentWeek = ref(1)
  const totalWeeks = ref(10) // 10-week program
  const weeklySchedule = ref([])
  const upcomingEvents = ref([])
  const todayEvents = ref([])
  const progress = ref({
    completedWeeks: 0,
    totalMaterials: 0,
    downloadedMaterials: 0,
    totalExams: 0,
    passedExams: 0,
    averageScore: 0
  })

  /**
   * Calculate which week of the program the student is in
   */
  const calculateCurrentWeek = (startDate) => {
    if (!startDate) return 1
    
    const start = new Date(startDate)
    const now = new Date()
    const diffTime = now - start
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const week = Math.floor(diffDays / 7) + 1
    
    // Clamp between 1 and total weeks
    return Math.max(1, Math.min(week, totalWeeks.value))
  }

  /**
   * Get days remaining in current week
   */
  const getDaysRemainingInWeek = computed(() => {
    if (!programStartDate.value) return 7
    
    const start = new Date(programStartDate.value)
    const now = new Date()
    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24))
    const daysIntoWeek = diffDays % 7
    
    return 7 - daysIntoWeek
  })

  /**
   * Get program progress percentage (based on completed items, not time)
   */
  const programProgress = computed(() => {
    // Calculate based on actual completion across all weeks
    const allWeeks = weeklySchedule.value
    if (!allWeeks.length) return 0
    
    let totalItems = 0
    let completedItems = 0
    
    allWeeks.forEach(week => {
      totalItems += week.totalItems || 0
      completedItems += week.completedItems || 0
    })
    
    if (totalItems === 0) return 0
    return Math.round((completedItems / totalItems) * 100)
  })

  /**
   * Get week date range
   */
  const getWeekDateRange = (weekNum) => {
    if (!programStartDate.value) return { start: null, end: null }
    
    const start = new Date(programStartDate.value)
    start.setDate(start.getDate() + (weekNum - 1) * 7)
    
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    
    return { start, end }
  }

  /**
   * Load student's program start date from their approved application
   */
  const loadProgramStartDate = async (userId) => {
    try {
      // Use server API to bypass permission issues
      const result = await $fetch(`/api/applications/${userId}/start-date`)
      
      if (result.programStartDate) {
        programStartDate.value = result.programStartDate
        currentWeek.value = calculateCurrentWeek(programStartDate.value)
      }
    }
    catch (e) {
      console.error('Failed to load program start date:', e)
    }
  }

  /**
   * Load all schedule data
   */
  const loadSchedule = async (userId) => {
    loading.value = true
    error.value = ''
    
    try {
      // Load program start date first
      await loadProgramStartDate(userId)
      
      // Fetch all data in parallel (with error handling for permission issues)
      const [contentRes, examsRes, attemptsRes, downloadsRes] = await Promise.all([
        // Published content
        databases.listDocuments(DB_ID, 'content', [
          Query.equal('isPublished', true),
          Query.orderAsc('week'),
          Query.limit(200)
        ]).catch(e => { console.error('Content fetch error:', e); return { documents: [] } }),
        // Published exams - use server API to bypass row-level permissions
        $fetch('/api/exams?published=true').catch(e => { console.error('Exams fetch error:', e); return [] }),
        // User's exam attempts
        databases.listDocuments(DB_ID, 'exam_attempts', [
          Query.equal('userId', userId),
          Query.equal('isSubmitted', true),
          Query.limit(100)
        ]).catch(e => { console.error('Attempts fetch error:', e); return { documents: [] } }),
        // User's downloads - fetch via server API to bypass permissions
        $fetch(`/api/downloads/${userId}`).catch(e => { console.error('Downloads fetch error:', e); return [] })
      ])

      const content = contentRes.documents || []
      // Exams come from server API as array directly
      const exams = Array.isArray(examsRes) ? examsRes : (examsRes.documents || [])
      const attempts = attemptsRes.documents || []
      // Downloads come from server API as array directly
      const downloads = Array.isArray(downloadsRes) ? downloadsRes : (downloadsRes.documents || [])

      // Build weekly schedule
      buildWeeklySchedule(content, exams, attempts, downloads)
      
      // Build upcoming events
      buildUpcomingEvents(content, exams, attempts)
      
      // Build today's events
      buildTodayEvents(content, exams)
      
      // Calculate progress
      calculateProgress(content, exams, attempts, downloads)
    }
    catch (e) {
      error.value = e.message
      console.error('Failed to load schedule:', e)
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Build the weekly schedule structure
   */
  const buildWeeklySchedule = (content, exams, attempts, downloads) => {
    const schedule = []
    const downloadedIds = new Set(downloads.map(d => d.contentId))
    const passedExamIds = new Set(
      attempts.filter(a => a.passed).map(a => a.examId)
    )
    const attemptedExamIds = new Set(attempts.map(a => a.examId))

    for (let week = 1; week <= totalWeeks.value; week++) {
      const weekContent = content.filter(c => c.week === week)
      const weekExams = exams.filter(e => e.week === week)
      const dateRange = getWeekDateRange(week)
      
      // Categorize content - handle various type names
      const materials = weekContent.filter(c => ['document', 'video', 'audio', 'pdf', 'doc', 'docx'].includes(c.type))
      const liveSessions = weekContent.filter(c => ['live_session', 'live-link', 'live_link'].includes(c.type))
      
      // Calculate week status
      let status = 'locked'
      if (week < currentWeek.value) {
        status = 'completed'
      } else if (week === currentWeek.value) {
        status = 'current'
      } else if (week === currentWeek.value + 1) {
        status = 'upcoming'
      }

      // Calculate completion for this week
      const totalItems = materials.length + weekExams.length
      let completedItems = 0
      
      materials.forEach(m => {
        if (downloadedIds.has(m.$id)) completedItems++
      })
      weekExams.forEach(e => {
        if (passedExamIds.has(e.$id)) completedItems++
      })

      schedule.push({
        week,
        status,
        dateRange,
        materials: materials.map(m => ({
          ...m,
          isDownloaded: downloadedIds.has(m.$id)
        })),
        liveSessions: liveSessions.map(ls => ({
          ...ls,
          isUpcoming: ls.liveStartTime && new Date(ls.liveStartTime) > new Date(),
          isLive: ls.liveStartTime && ls.liveEndTime && 
                  new Date(ls.liveStartTime) <= new Date() && 
                  new Date(ls.liveEndTime) >= new Date()
        })),
        exams: weekExams.map(e => ({
          ...e,
          isPassed: passedExamIds.has(e.$id),
          isAttempted: attemptedExamIds.has(e.$id),
          bestScore: Math.max(...attempts.filter(a => a.examId === e.$id).map(a => a.score || 0), 0)
        })),
        completion: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
        totalItems,
        completedItems
      })
    }

    weeklySchedule.value = schedule
  }

  /**
   * Build upcoming events (next 7 days)
   */
  const buildUpcomingEvents = (content, exams, attempts) => {
    const events = []
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const passedExamIds = new Set(attempts.filter(a => a.passed).map(a => a.examId))

    // Live sessions
    content
      .filter(c => c.type === 'live_session' && c.liveStartTime)
      .forEach(session => {
        const startTime = new Date(session.liveStartTime)
        if (startTime >= now && startTime <= weekFromNow) {
          events.push({
            type: 'live_session',
            title: session.title,
            description: session.description,
            date: startTime,
            week: session.week,
            link: session.liveLink,
            icon: 'videocam',
            color: 'blue'
          })
        }
      })

    // Exam deadlines
    exams.forEach(exam => {
      const endDate = new Date(exam.endDate)
      if (endDate >= now && endDate <= weekFromNow && !passedExamIds.has(exam.$id)) {
        events.push({
          type: 'exam_deadline',
          title: `${exam.title} - Deadline`,
          description: `Week ${exam.week} exam closes`,
          date: endDate,
          week: exam.week,
          examId: exam.$id,
          icon: 'quiz',
          color: 'red'
        })
      }
    })

    // Sort by date
    events.sort((a, b) => a.date - b.date)
    upcomingEvents.value = events
  }

  /**
   * Build today's events
   */
  const buildTodayEvents = (content, exams) => {
    const events = []
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

    // Live sessions today
    content
      .filter(c => c.type === 'live_session' && c.liveStartTime)
      .forEach(session => {
        const startTime = new Date(session.liveStartTime)
        if (startTime >= todayStart && startTime < todayEnd) {
          const isLive = session.liveEndTime && 
                         startTime <= now && 
                         new Date(session.liveEndTime) >= now
          events.push({
            type: 'live_session',
            title: session.title,
            time: startTime,
            link: session.liveLink,
            isLive,
            icon: 'videocam'
          })
        }
      })

    // Exams due today
    exams.forEach(exam => {
      const endDate = new Date(exam.endDate)
      if (endDate >= todayStart && endDate < todayEnd) {
        events.push({
          type: 'exam_deadline',
          title: `${exam.title} closes today!`,
          time: endDate,
          examId: exam.$id,
          icon: 'quiz',
          urgent: true
        })
      }
    })

    events.sort((a, b) => a.time - b.time)
    todayEvents.value = events
  }

  /**
   * Calculate overall progress
   */
  const calculateProgress = (content, exams, attempts, downloads) => {
    const materials = content.filter(c => ['document', 'video', 'audio', 'pdf', 'doc', 'docx'].includes(c.type))
    const downloadedIds = new Set(downloads.map(d => d.contentId))
    const passedAttempts = attempts.filter(a => a.passed)
    const passedExamIds = new Set(passedAttempts.map(a => a.examId))
    
    // Calculate completed weeks (all exams passed for that week)
    let completedWeeks = 0
    for (let week = 1; week < currentWeek.value; week++) {
      const weekExams = exams.filter(e => e.week === week)
      const allPassed = weekExams.length === 0 || weekExams.every(e => passedExamIds.has(e.$id))
      if (allPassed) completedWeeks++
    }

    // Calculate average score
    const scores = attempts.map(a => a.score || 0)
    const avgScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0

    progress.value = {
      completedWeeks,
      totalMaterials: materials.length,
      downloadedMaterials: materials.filter(m => downloadedIds.has(m.$id)).length,
      totalExams: exams.length,
      passedExams: passedExamIds.size,
      averageScore: avgScore
    }
  }

  /**
   * Get status badge info
   */
  const getWeekStatusInfo = (status) => {
    const statusMap = {
      completed: { label: 'Completed', color: 'green', icon: 'check_circle' },
      current: { label: 'Current Week', color: 'primary', icon: 'play_circle' },
      upcoming: { label: 'Next Week', color: 'yellow', icon: 'schedule' },
      locked: { label: 'Locked', color: 'gray', icon: 'lock' }
    }
    return statusMap[status] || statusMap.locked
  }

  /**
   * Format relative time
   */
  const formatRelativeTime = (date) => {
    const now = new Date()
    const diff = date - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (days > 1) return `in ${days} days`
    if (days === 1) return 'tomorrow'
    if (hours > 1) return `in ${hours} hours`
    if (hours === 1) return 'in 1 hour'
    if (minutes > 1) return `in ${minutes} minutes`
    if (minutes >= 0) return 'starting now'
    return 'started'
  }

  return {
    // State
    loading,
    error,
    
    // Data
    programStartDate,
    currentWeek,
    totalWeeks,
    weeklySchedule,
    upcomingEvents,
    todayEvents,
    progress,
    
    // Computed
    getDaysRemainingInWeek,
    programProgress,
    
    // Methods
    loadSchedule,
    getWeekDateRange,
    getWeekStatusInfo,
    formatRelativeTime
  }
}
