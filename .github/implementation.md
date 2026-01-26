
```markdown
# **MACEOS Academy Platform: System Architecture Breakdown**
*A Nuxt.js 4 + Appwrite EdTech Platform*

## **🌐 Architecture Overview**
The code you see here are suggestions. Write the code you believe is best.
```

┌─────────────────────────────────────────────────────────────┐
│                   Nuxt.js 4 Frontend                        │
│  (Client-Side + Server-Side Rendering)                      │
├─────────────────────────────────────────────────────────────┤
│                    Appwrite Backend                         │
│  (Database, Auth, Storage, Functions)                       │
└─────────────────────────────────────────────────────────────┘

## **🔑 CORE ENTITIES (Data Models)**
```javascript

### **1. User Entity**
*Mapped to Appwrite Auth (Users) & Database Collection (Profiles)*
```javascript
User {
  $id: string (Appwrite User ID)
  email: string
  labels: ['student', 'admin', 'pending'] // Used for Role-Based Access Control (RBAC)
  profile: {
    fullName: string
    country: string
    phone?: string
    avatarId?: string (Appwrite Storage File ID)
  }
  enrollmentDate: string (ISO 8601)
  status: 'active' | 'suspended' | 'graduated'
  metadata: {
    lastLogin: string (ISO 8601)
    applicationStep: number (1-4)
  }
}

```

### **2. Course Entity**

```javascript
Course {
  $id: string
  title: string
  description: string
  duration: '10-months'
  milestones: [ // Stored as a JSON string or related collection
    {
      week: number (1-10)
      title: string
      type: 'lesson' | 'exam' | 'live'
      startDate: string (ISO 8601)
      endDate: string (ISO 8601)
      status: 'upcoming' | 'active' | 'completed'
    }
  ]
  currentWeek: number
}

```

### **3. Application Entity**

```javascript
Application {
  $id: string
  userId: string (relation to User)
  personalInfo: { // JSON attribute
    fullName: string
    email: string
    dateOfBirth: string
    education: string[]
  }
  payment: { // JSON attribute
    status: 'pending' | 'completed' | 'failed'
    amount: number
    currency: string
    gateway: 'stripe' | 'flutterwave'
    transactionId?: string
  }
  submittedAt: string (ISO 8601)
  reviewedBy?: string (Admin ID)
  status: 'pending' | 'approved' | 'rejected'
}

```

### **4. Content Entity**

```javascript
Content {
  $id: string
  type: 'pdf' | 'video' | 'exam' | 'live-link'
  title: string
  description?: string
  week: number
  downloadLimit: number (default: 1)
  downloadCount: number
  fileId: string (Appwrite Storage File ID)
  accessibleAfter: string (ISO 8601)
  accessibleUntil: string (ISO 8601)
  createdBy: string (Admin ID)
  createdAt: string (ISO 8601)
}

```

### **5. Exam Entity**

```javascript
Exam {
  $id: string
  title: string
  week: number (2 or 4)
  duration: number (minutes)
  questions: [ // JSON attribute or separate collection
    {
      id: string
      type: 'multiple-choice' | 'essay'
      question: string
      options?: string[]
      correctAnswer?: string
      points: number
    }
  ]
  passingScore: number
  attemptsAllowed: number
  startDate: string (ISO 8601)
  endDate: string (ISO 8601)
}

```

### **6. Support Ticket Entity**

```javascript
SupportTicket {
  $id: string
  userId: string
  category: 'technical' | 'content' | 'payment' | 'other'
  subject: string
  message: string
  attachmentIds?: string[] (Appwrite Storage File IDs)
  status: 'open' | 'in-progress' | 'resolved'
  adminNotes?: string
  createdAt: string (ISO 8601)
  resolvedAt?: string (ISO 8601)
}

```

---

## **🔄 SYSTEM PROCESSES**

### **A. ENTRYWAY PROCESSES**

#### **P1: User Registration & Application**

```
Trigger: User visits landing page
1. User → clicks "Apply Now"
2. System → creates Appwrite Account (Auth)
3. User → fills 4-step application form
4. System → saves to Database: Application collection
5. User → redirected to payment gateway (Stripe/Flutterwave)
6. Payment Gateway → sends webhook to Appwrite Function
7. Appwrite Function → updates Application.payment.status
8. System → sends email confirmation
9. Admin → notified in dashboard

```

#### **P2: Payment Processing**

```
Trigger: User submits payment
1. Stripe/Flutterwave SDK → collects payment
2. Webhook → /v1/functions/{functionId}/executions (Appwrite Function)
3. Function → verifies payment signature
4. Function → updates Application document
5. Function → sends receipt email
6. Function → updates User labels (role='student')

```

---

### **B. STUDENT EXPERIENCE PROCESSES**

#### **P3: Course Access & Material Download**

```
Trigger: Student logs into dashboard
1. System → checks User Team Membership or Labels
2. System → fetches current week from Course collection
3. Dashboard → displays week-specific materials
4. Student → clicks download button
5. System → checks Content.downloadCount < downloadLimit
6. System → calls Appwrite Storage API (getFileView / getFileDownload)
   *Note: For strict one-time downloads, use an Appwrite Function to proxy the file and increment count*
7. Function → increments Content.downloadCount
8. Function → logs download in 'DownloadLogs' collection
9. Student → receives file stream

```

#### **P4: Exam Taking Process**

```
Trigger: Student enters exam hall
1. System → validates exam timing (Server-side check)
2. System → creates ExamAttempt document
3. Timer → starts (duration from Exam.duration)
4. Student → answers questions (auto-save every 30s)
5. Student → submits exam
6. System → Appwrite Function auto-grades multiple choice
7. System → flags essay questions for admin review
8. System → calculates score
9. System → updates Student progress
10. Admin → notified if exam requires manual grading

```

#### **P5: Support Ticket Creation**

```
Trigger: Student submits help request
1. Student → fills support form
2. System → creates SupportTicket document
3. Appwrite Function (Event Trigger) → sends email to admin
4. Admin → receives notification in dashboard
5. Admin → responds via dashboard
6. System → updates ticket status
7. Student → receives email notification

```

---

### **C. ADMIN PROCESSES**

#### **P6: Student Management**

```
Trigger: Admin opens Student Manager
1. System → fetches all Users from 'Users' collection with label='student'
2. Admin → filters by status/date
3. Admin → selects student action (approve/suspend)
4. System → updates User status in Database
5. System → updates User status in Auth (block/unblock account)
6. System → logs action in AdminLogs collection

```

#### **P7: Content Upload Process**

```
Trigger: Admin uploads material
1. Admin → selects content type (PDF/Video/Exam)
2. Admin → uploads file to Appwrite Storage
3. System → creates Content document with File ID
4. Admin → sets accessibility dates
5. System → schedules availability based on Course milestones
6. Students → automatically see content when available

```

#### **P8: Live Class Link Distribution**

```
Trigger: Admin adds live session
1. Admin → creates Content with type='live-link'
2. Admin → sets Zoom/Meet URL
3. Admin → schedules start time
4. System → makes link visible 15 minutes before start
5. Students → see "Join Now" button in dashboard
6. System → hides link 1 hour after scheduled end

```

#### **P9: Milestone Scheduling**

```
Trigger: Admin sets course schedule
1. Admin → accesses Scheduler tool
2. Admin → sets start date for cohort
3. System → auto-generates 10-week milestone schedule
4. System → creates Content accessibility windows
5. System → schedules exam dates (week 2 & 4)
6. System → sends weekly email reminders to students

```

---

## **📦 DATA STORES (Appwrite)**

### **Database (Database ID: `academia_db`)**

*Collections:*

```
/users (Profile Data)
  - Attributes: userId, email, role, metadata...
  - Permissions: user:read, admin:write

/applications
  - Attributes: userId, personalInfo, payment...
  - Indexes: status_idx, date_idx

/courses
  - Attributes: title, milestones...

/content
  - Attributes: type, week, fileId, accessibleAfter...
  - Indexes: week_idx, type_idx

/exams
  - Attributes: questions, duration...

/examAttempts
  - Attributes: examId, studentId, answers, score...

/supportTickets
  - Attributes: category, message, status...

/adminLogs
  - Attributes: adminId, action, targetId...

/downloadLogs
  - Attributes: userId, contentId, timestamp...

```

### **Storage Buckets:**

```
/course-materials (Bucket ID: `course_materials`)
  - Permissions: role:student (read), role:admin (write)

/student-submissions (Bucket ID: `submissions`)
  - Permissions: role:student (create), role:admin (read)

/profile-images (Bucket ID: `avatars`)
  - Permissions: user (write own), any (read)

```

### **Appwrite Functions:**

```
- onUserCreated (Event: users.*.create)
- onPaymentWebhook (HTTP Endpoint)
- sendEmailNotifications (Topic/Queue or Direct Call)
- scheduleContentAvailability (CRON Schedule)
- autoGradeExams (Triggered by Database create)
- cleanupExpiredLinks (CRON Schedule)

```

---

## **🔐 SECURITY RULES (Appwrite Permissions)**

```javascript
// Appwrite uses a permission model based on Roles and Users.
// Permissions are set at Collection and Document levels.

// 1. User Profiles Collection
Permission.read(Role.user($id)), // Users read their own profile
Permission.update(Role.user($id)), // Users update their own profile
Permission.read(Role.label('admin')), // Admins read all
Permission.write(Role.label('admin')) // Admins write all

// 2. Content Collection
Permission.read(Role.label('student')), // All students can read content metadata
Permission.write(Role.label('admin'))   // Only admins can add content
// *Note: Fine-grained access based on dates is handled via query logic in Appwrite Functions 
// or by dynamically updating document permissions via a scheduled Function.*

// 3. Exams Collection
Permission.read(Role.label('student')),
Permission.write(Role.label('admin'))

// 4. Storage: Course Materials
Permission.read(Role.label('student')), // Students can download
Permission.write(Role.label('admin'))   // Admins can upload

```

---

## **🚀 DEPLOYMENT STRUCTURE**

```
/nuxt-app/
  ├── pages/
  │   ├── index.vue (Landing)
  │   ├── apply/ (Application flow)
  │   ├── dashboard/
  │   │   ├── index.vue (Student Dashboard)
  │   │   ├── materials/[week].vue
  │   │   ├── exam/[id].vue
  │   │   └── support.vue
  │   └── admin/
  │       ├── students.vue
  │       ├── content.vue
  │       ├── live-sessions.vue
  │       └── schedule.vue
  │
  ├── composables/
  │   ├── useAppwrite.js (Appwrite Client initialization)
  │   ├── useAuth.js (Account state & Session management)
  │   └── useCourse.js (Database interactions)
  │
  ├── server/
  │   ├── api/
  │   │   ├── payment/
  │   │   └── webhooks/
  │   └── middleware/ (Auth guards)
  │
  └── appwrite-functions/
      ├── payment-webhook/
      │   └── src/ (Node.js/Python/Dart runtime)
      ├── auto-grader/
      └── notification-sender/

```

---

## **⚡ PERFORMANCE OPTIMIZATIONS**

1. **Database Indexes:** Required for all Appwrite queries (Status, Date, Week).
2. **CDN & Cache:** Appwrite handles caching for Storage files.
3. **Pagination:** Use `Query.limit()` and `Query.offset()` for large lists.
4. **Real-time Subscriptions:** `client.subscribe` for active dashboard updates (e.g., ticket status).
5. **Function Execution:** Keep functions "warm" or use lightweight runtimes (e.g., Dart/Node) for speed.

---

## **📱 FRONTEND COMPOSABLES (Nuxt 4)**

```javascript
// Example: useCourseMaterials.js
import { Client, Databases, Storage, Query } from 'appwrite';

export const useCourseMaterials = () => {
  const { $appwrite } = useNuxtApp(); // Assuming plugin injection
  const databases = new Databases($appwrite.client);
  const storage = new Storage($appwrite.client);
  
  const currentWeek = ref(1);
  const DB_ID = 'academia_db';
  const COLLECTION_ID = 'content';
  
  const fetchMaterials = async (week: number) => {
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTION_ID,
      [
        Query.equal('week', week),
        Query.orderDesc('createdAt')
      ]
    );
    return response.documents;
  };
  
  const getDownloadUrl = (fileId: string) => {
    // Returns a URL to view/download the file
    return storage.getFileView('course_materials', fileId);
  };
  
  return { fetchMaterials, getDownloadUrl, currentWeek };
};

```

---

## **🔔 NOTIFICATION SYSTEM**

| Event | Trigger | Action |
| --- | --- | --- |
| Application Submitted | Database Document Created | Appwrite Function → Email to admin |
| Payment Success | Webhook → Appwrite Function | Function → Email student, update DB |
| New Content Available | Scheduled Function (CRON) | Update permissions/notify student |
| Exam Starting Soon | Scheduled Function (CRON) | Push notification / Email |
| Support Response | Database Document Updated | Real-time subscription / Email |
| Milestone Complete | Week completed logic | Progress email |

---

## **📊 MONITORING & ANALYTICS**

1. **Appwrite Dashboard:** Monitor bandwidth, requests, and storage usage.
2. **Function Logs:** Review execution logs in Appwrite Console.
3. **Custom Collection:** `usage_metrics` collection for specific app-level tracking.
4. **Backup:** Automated backups provided by Appwrite (or self-hosted volume backups).

---

## **🔧 SETUP CHECKLIST**

### **Phase 1: Appwrite Setup**

* [ ] Install Appwrite (Self-hosted) or Create Cloud Project
* [ ] Create Project & API Keys
* [ ] Enable Auth Methods (Email/Password)
* [ ] Create Database & Collections (Users, Courses, Content, etc.)
* [ ] Define Attributes & Indexes for all Collections
* [ ] Create Storage Buckets
* [ ] Deploy Appwrite Functions
* [ ] Setup Stripe/Flutterwave Webhooks pointing to Appwrite Function URL

### **Phase 2: Nuxt 4 Setup**

* [ ] Initialize Nuxt 4 project
* [ ] Install `appwrite` SDK
* [ ] Configure SSR with Appwrite Node SDK (for server routes)
* [ ] Build layout components
* [ ] Implement routing middleware

### **Phase 3: Core Features**

* [ ] Landing & Application flow
* [ ] Payment integration
* [ ] Student dashboard
* [ ] Admin panel
* [ ] Content management system

This architecture leverages Appwrite's open-source backend-as-a-service features to provide a robust, scalable alternative to Firebase.
