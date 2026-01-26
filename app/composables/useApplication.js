import { databases } from '~/utils/appwrite'
import { ID, Query } from 'appwrite'

const DB_ID = 'academia_db'
const COLLECTION_ID = 'applications'

export const useApplication = () => {
  const application = useState('current_application', () => null)
  const loading = useState('application_loading', () => false)
  const error = useState('application_error', () => null)

  // Application form state persisted across steps
  const formData = useState('application_form', () => ({
    // Step 1: Personal Info
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    country: '',
    
    // Step 2: Education & Background
    highestEducation: '',
    fieldOfStudy: '',
    currentOccupation: '',
    yearsOfExperience: '',
    whyJoin: '',
  }))

  // Current step tracker
  const currentStep = useState('application_step', () => 1)

  /**
   * Save form data for current step
   */
  const saveStepData = (stepData) => {
    formData.value = { ...formData.value, ...stepData }
  }

  /**
   * Move to next step
   */
  const nextStep = () => {
    if (currentStep.value < 4) {
      currentStep.value++
    }
  }

  /**
   * Move to previous step
   */
  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  /**
   * Go to specific step
   */
  const goToStep = (step) => {
    if (step >= 1 && step <= 4) {
      currentStep.value = step
    }
  }

  /**
   * Create application in database with atomic fields
   */
  const createApplication = async (userId) => {
    loading.value = true
    error.value = null
    
    try {
      const applicationData = {
        userId,
        // Personal Info (atomic)
        fullName: formData.value.fullName,
        email: formData.value.email,
        phone: formData.value.phone,
        dateOfBirth: formData.value.dateOfBirth,
        country: formData.value.country,
        // Education (atomic)
        highestEducation: formData.value.highestEducation,
        fieldOfStudy: formData.value.fieldOfStudy,
        currentOccupation: formData.value.currentOccupation,
        yearsOfExperience: formData.value.yearsOfExperience,
        whyJoin: formData.value.whyJoin,
        // Payment fields (atomic)
        paymentStatus: 'pending',
        paymentAmount: 0,
        paymentReference: '',
        paymentVerified: false,
        // Application status
        status: 'draft',
        submittedAt: new Date().toISOString(),
      }

      const doc = await databases.createDocument(
        DB_ID,
        COLLECTION_ID,
        ID.unique(),
        applicationData
      )
      
      application.value = doc
      return { success: true, data: doc }
    }
    catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Fetch user's existing application
   */
  const fetchApplication = async (userId) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTION_ID,
        [Query.equal('userId', userId)]
      )
      
      if (response.documents.length > 0) {
        application.value = response.documents[0]
        return response.documents[0]
      }
      return null
    }
    catch (e) {
      error.value = e.message
      return null
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Initialize payment - stores pending reference
   */
  const initializePayment = async (applicationId, reference, amount) => {
    loading.value = true
    error.value = null
    
    try {
      const doc = await databases.updateDocument(
        DB_ID,
        COLLECTION_ID,
        applicationId,
        {
          paymentReference: reference,
          paymentAmount: amount,
          paymentStatus: 'pending',
        }
      )
      
      application.value = doc
      return { success: true, data: doc }
    }
    catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Complete payment after server-side verification
   */
  const completePayment = async (applicationId) => {
    loading.value = true
    error.value = null
    
    try {
      const doc = await databases.updateDocument(
        DB_ID,
        COLLECTION_ID,
        applicationId,
        {
          paymentStatus: 'completed',
          paymentVerified: true,
          status: 'submitted',
        }
      )
      
      application.value = doc
      return { success: true, data: doc }
    }
    catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Check if application is complete (payment verified)
   */
  const isApplicationComplete = computed(() => {
    return application.value?.paymentVerified === true && 
           application.value?.status === 'submitted'
  })

  /**
   * Get application status for display
   */
  const applicationStatus = computed(() => {
    if (!application.value) return 'none'
    if (application.value.status === 'approved') return 'approved'
    if (application.value.status === 'rejected') return 'rejected'
    if (application.value.paymentVerified && application.value.status === 'submitted') return 'pending_review'
    if (application.value.paymentStatus === 'pending') return 'payment_pending'
    return 'draft'
  })

  /**
   * Reset application form
   */
  const resetForm = () => {
    formData.value = {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      country: '',
      highestEducation: '',
      fieldOfStudy: '',
      currentOccupation: '',
      yearsOfExperience: '',
      whyJoin: '',
    }
    currentStep.value = 1
    application.value = null
  }

  return {
    application,
    formData,
    currentStep,
    loading,
    error,
    saveStepData,
    nextStep,
    prevStep,
    goToStep,
    createApplication,
    fetchApplication,
    initializePayment,
    completePayment,
    isApplicationComplete,
    applicationStatus,
    resetForm,
  }
}
