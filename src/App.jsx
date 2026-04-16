import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { 
  User, Clock, CheckCircle, XCircle, Star, Bell, 
  Settings, Users, QrCode, ArrowRight, Play, LogOut, AlertTriangle, GraduationCap, Briefcase, Lock, Monitor, Share, FileText, BarChart, Calendar, Globe
} from 'lucide-react';

// 🔥 IMPORT FIREBASE FUNCTIONS
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, doc, setDoc, updateDoc, query, orderBy } from 'firebase/firestore';

// 🔥 ใส่ตั้งค่า Firebase ของคุณที่นี่
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================================
// 🌐 DICTIONARY (ระบบพจนานุกรมแปลภาษา)
// ============================================================================
const DICT = {
  th: {
    kioskTitle: "ระบบคิวรับบริการ",
    kioskDesc: "สแกนเพื่อรับคิวผ่านสมาร์ทโฟน \n หรือกดปุ่มด้านล่างเพื่อรับคิวที่ตู้",
    kioskBtn: "กดเพื่อรับคิว",
    backToHome: "กลับหน้าหลัก",
    formTitle: "กรอกข้อมูลรับคิว",
    q1: "1. ท่านคือใคร?",
    q2: "2. รหัสนิสิต",
    q3: "3. เรื่องที่ต้องการติดต่อ",
    q4: "4. รายละเอียดเพิ่มเติม",
    student: "นิสิต",
    parent: "ผู้ปกครอง",
    external: "บุคคลภายนอก",
    optional: "(ไม่บังคับ)",
    optionalFast: "(ระบุเพื่อความรวดเร็ว / ไม่บังคับ)",
    placeholderId: "กรอกรหัสนิสิต...",
    placeholderParentId: "กรอกรหัสนิสิตของบุตรหลาน (ถ้ามี)...",
    placeholderDetails: "เช่น ขอใบรับรองสภาพนิสิต, จ่ายค่าเทอมล่าช้า...",
    confirmBtn: "ยืนยันรับคิว",
    selectBranch: "สาขาวิชา (ไม่บังคับ)",
    queueNumber: "หมายเลขคิว",
    contactPerson: "ผู้ติดต่อ",
    waitFrontDesk: "รอเรียกที่จุดคัดกรอง",
    queuesAhead: "คิวหน้าคุณ",
    estTime: "เวลาประมาณการ: ~",
    estMins: "นาที",
    forwardedToSpecialist: "ส่งต่อเจ้าหน้าที่เฉพาะทางแล้ว",
    waitingFor: "กำลังรอ",
    yourTurn: "ถึงคิวของคุณแล้ว!",
    pleaseProceed: "โปรดติดต่อที่เคาน์เตอร์:",
    liveUpdate: "Live Update: กำลังอัปเดตอัตโนมัติ",
    notFoundTitle: "ไม่พบข้อมูลคิว",
    serviceCompleted: "บริการเสร็จสิ้น",
    thanksFeedback: "ขอบคุณที่ใช้บริการ ให้คะแนนความพึงพอใจด้านล่างได้เลยครับ",
    missedTitle: "คิวถูกข้าม",
    missedDesc: "คุณไม่มารายงานตัวตามเวลาที่กำหนด",
    getNewTicket: "รับคิวใหม่",
    followUpTitle: "รอดำเนินการ / นัดหมาย",
    followUpTodo: "รายละเอียดสิ่งที่ต้องทำเพิ่ม:",
    followUpDate: "เวลานัดหมาย:",
    autoRequeueNote: "* ระบบจะเรียกคิวของคุณใหม่อัตโนมัติเมื่อถึงเวลานัดหมาย",
    toastPrepare: "เตรียมตัว! ใกล้ถึงคิวของคุณแล้ว (อีก 2 คิว)",
    toastTurn: "ถึงคิวของคุณแล้ว! โปรดเดินไปที่จุดบริการ",
    appointmentTag: "นัดหมาย",
    nowServing: "NOW SERVING (กำลังเรียก)",
    proceedTo: "เชิญที่",
    noServingQueue: "ยังไม่มีคิวที่กำลังให้บริการ",
    waitingQueue: "WAITING (รอคัดกรอง)",
    totalQueues: "คิวทั้งหมด",
    noWaitingQueue: "ไม่มีคิวรอคัดกรอง",
    loginTo: "เข้าสู่ระบบ",
    logout: "ออกระบบ",
    waitScreening: "รอคัดกรอง:",
    queues: "คิว",
    screeningQueue: "กำลังคัดกรองคิว",
    forwardedQueue: "กำลังให้บริการ (ส่งต่อมา)",
    detailsFromUser: "รายละเอียดเพิ่มเติมจากผู้ติดต่อ:",
    resolveHere: "ตอบได้ / จบเรื่องที่นี่",
    forwardSpec: "ส่งต่อ Specialist",
    makeAppt: "นัดหมาย/รอทำต่อ",
    noShow: "ไม่มา",
    cancel: "ยกเลิก",
    saveAppt: "บันทึก & นัดหมาย",
    callNext: "เรียกคิวถัดไป",
    yourQueue: "คิวของคุณ",
    skills: "ทักษะ:",
    matchTopic: "✨ ตรงกับเรื่องที่ติดต่อ",
    apptDetails: "รายละเอียดสิ่งที่ต้องทำต่อ",
    apptDate: "วันที่และเวลานัดหมาย (ถ้ามี)",
    dashboard: "Executive Dashboard",
    totalSystem: "คิวทั้งหมดระบบ",
    resolvedFront: "จบที่ Front Desk",
    resolvedSpec: "ส่งต่อ Specialist",
    pendingAppt: "รอดำเนินการ/นัดหมาย",
    stuckSys: "ค้างระบบ (รอ+ทำ)",
    liveDb: "ฐานข้อมูลคิวแบบละเอียด (Live Data)",
  },
  en: {
    kioskTitle: "Queue Management System",
    kioskDesc: "Scan to get your ticket via smartphone \n or tap the button below for a physical ticket",
    kioskBtn: "Get Ticket",
    backToHome: "Back to Home",
    formTitle: "Fill Information",
    q1: "1. Who are you?",
    q2: "2. Student ID",
    q3: "3. Topic of inquiry",
    q4: "4. Additional Details",
    student: "Student",
    parent: "Parent",
    external: "Visitor",
    optional: "(Optional)",
    optionalFast: "(For faster service / Optional)",
    placeholderId: "Enter Student ID...",
    placeholderParentId: "Enter Child's Student ID (If any)...",
    placeholderDetails: "e.g., Requesting a certificate, Late tuition payment...",
    confirmBtn: "Confirm Ticket",
    selectBranch: "Program/Branch (Optional)",
    queueNumber: "QUEUE NUMBER",
    contactPerson: "Contact Person",
    waitFrontDesk: "Waiting for Front Desk",
    queuesAhead: "Queues Ahead",
    estTime: "Estimated Time: ~",
    estMins: "Mins",
    forwardedToSpecialist: "Forwarded to Specialist",
    waitingFor: "Waiting for",
    yourTurn: "IT'S YOUR TURN!",
    pleaseProceed: "Please proceed to counter:",
    liveUpdate: "Live Update: Auto-syncing",
    notFoundTitle: "Ticket Not Found",
    serviceCompleted: "Service Completed",
    thanksFeedback: "Thank you! Please rate our service below.",
    missedTitle: "Ticket Skipped",
    missedDesc: "You did not show up at the specified time.",
    getNewTicket: "Get New Ticket",
    followUpTitle: "Pending / Appointment",
    followUpTodo: "Action Required / Note:",
    followUpDate: "Appointment Time:",
    autoRequeueNote: "* System will auto re-queue you at the appointment time.",
    toastPrepare: "Get Ready! Your turn is coming up (2 queues away)",
    toastTurn: "It's your turn! Please proceed to the counter.",
    appointmentTag: "Appt.",
    nowServing: "NOW SERVING",
    proceedTo: "Proceed To",
    noServingQueue: "No currently serving queues",
    waitingQueue: "WAITING LINE",
    totalQueues: "Total Queues",
    noWaitingQueue: "No waiting queues",
    loginTo: "Login to",
    logout: "Logout",
    waitScreening: "Waiting:",
    queues: "Qs",
    screeningQueue: "Screening Queue",
    forwardedQueue: "Serving Queue (Forwarded)",
    detailsFromUser: "Details from user:",
    resolveHere: "Resolved Here",
    forwardSpec: "Forward to Specialist",
    makeAppt: "Appointment / Pending",
    noShow: "No Show",
    cancel: "Cancel",
    saveAppt: "Save & Appoint",
    callNext: "Call Next Queue",
    yourQueue: "Your Queues",
    skills: "Skills:",
    matchTopic: "✨ Matches inquiry topic",
    apptDetails: "Follow-up Details / Note",
    apptDate: "Appointment Date & Time (Optional)",
    dashboard: "Executive Dashboard",
    totalSystem: "Total System Qs",
    resolvedFront: "Resolved at Front",
    resolvedSpec: "Forwarded to Spec",
    pendingAppt: "Pending/Appt",
    stuckSys: "Active in System",
    liveDb: "Live Detailed Database",
  }
};

// --- MOCK DATA & CONFIG ---
const TOPICS = [
  { id: 'acad', name_th: 'วิชาการ/ทะเบียน/ตารางเรียนตารางสอบ', name_en: 'Academics/Registry/Schedule', avgTime: 5 },
  { id: 'fin', name_th: 'การเงิน/พัสดุ', name_en: 'Finance / Procurement', avgTime: 8 },
  { id: 'sa', name_th: 'ทุนการศึกษา/ฝึกงาน/กิจการนิสิต', name_en: 'Scholarship / Internship / Student Affairs', avgTime: 10 },
  { id: 'inter', name_th: 'ต่างประเทศ/แลกเปลี่ยน', name_en: 'International / Exchange', avgTime: 10 },
  { id: 'admin', name_th: 'Admission', name_en: 'Admission', avgTime: 5 },
];

const BRANCHES = [
  { id: 'ADME', name: 'ADME' }, { id: 'AERO', name: 'AERO' }, { id: 'ICE', name: 'ICE' },
  { id: 'NANO', name: 'NANO' }, { id: 'RoboticsAI', name: 'RoboticsAI' }, { id: 'SEMI', name: 'SEMI' },
];

const INITIAL_STAFF = [
  { id: 'fd1', name_th: 'Front Desk 1 (จุดคัดกรอง)', name_en: 'Front Desk 1 (Screening)', role: 'frontdesk', skills: [], isReady: true },
  { id: 'fd2', name_th: 'Front Desk 2 (จุดคัดกรอง)', name_en: 'Front Desk 2 (Screening)', role: 'frontdesk', skills: [], isReady: true },
  { id: 's1', name_th: 'สตาฟ เอ (วิชาการ/Admission)', name_en: 'Staff A (Acad/Admission)', role: 'specialist', skills: ['acad', 'admin'], isReady: true },
  { id: 's2', name_th: 'สตาฟ บี (การเงิน/พัสดุ)', name_en: 'Staff B (Fin/Procure)', role: 'specialist', skills: ['fin'], isReady: true },
  { id: 's3', name_th: 'สตาฟ ซี (All-rounder)', name_en: 'Staff C (All-rounder)', role: 'specialist', skills: ['acad', 'fin', 'sa', 'inter', 'admin'], isReady: true },
];

const TIMEOUT_MS = 3 * 60 * 1000;

// --- UTILS ---
const getTopicName = (topicId, branch, lang) => {
  const topicObj = TOPICS.find(top => top.id === topicId);
  if (!topicObj) return 'General';
  const baseName = lang === 'th' ? topicObj.name_th : topicObj.name_en;
  return branch ? `${baseName} (${branch})` : baseName;
};

const getUserTypeLabel = (type, t) => {
  switch(type) {
    case 'student': return t.student;
    case 'parent': return t.parent;
    case 'external': return t.external;
    default: return 'User';
  }
};

const playNotifySound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
    oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); 
    oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); 
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 1);
  } catch (e) {
    console.log("Audio play failed");
  }
};

// ============================================================================
// MAIN APP STRUCTURE
// ============================================================================

const ProtectedRoute = ({ isAllowed, redirectPath = '/', children }) => {
  if (!isAllowed) return <Navigate to={redirectPath} replace />;
  return children;
};

function MainLayout() {
  const navigate = useNavigate();
  
  const [lang, setLang] = useState('th'); 
  const t = DICT[lang];

  const [queues, setQueues] = useState([]);
  const [staff, setStaff] = useState([]); 
  
  const [loggedInFrontId, setLoggedInFrontId] = useState(null);
  const [loggedInStaffId, setLoggedInStaffId] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // 1. ฟังการเปลี่ยนแปลงของข้อมูล Queues
  useEffect(() => {
    try {
      const q = query(collection(db, 'queues'), orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const queueData = [];
        snapshot.forEach((doc) => {
          queueData.push({ id: doc.id, ...doc.data() });
        });
        setQueues(queueData);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error("Firebase connection error. Ensure your config is set properly.", err);
    }
  }, []);

  // 2. ฟังการเปลี่ยนแปลงและดึงข้อมูล Staff จาก Firebase
  useEffect(() => {
    try {
      const staffQuery = query(collection(db, 'staffs'));
      const unsubscribeStaff = onSnapshot(staffQuery, (snapshot) => {
        if (snapshot.empty) {
          console.log("Seeding initial staff data...");
          INITIAL_STAFF.forEach(async (s) => {
            await setDoc(doc(db, 'staffs', s.id), s);
          });
        } else {
          const staffData = [];
          snapshot.forEach((doc) => staffData.push({ id: doc.id, ...doc.data() }));
          setStaff(staffData);
        }
      });
      return () => unsubscribeStaff();
    } catch(err) {}
  }, []);

  // 3. Background Worker: Auto-skip & Auto-Requeue
  useEffect(() => {
    if (!isAdminLoggedIn && !loggedInFrontId && !loggedInStaffId) return;

    const interval = setInterval(() => {
      const now = Date.now();
      queues.forEach(async (q) => {
        if (q.status.includes('serving') && q.calledAt && (now - q.calledAt > TIMEOUT_MS)) {
          await updateDoc(doc(db, 'queues', q.id), { status: 'missed', autoSkipped: true });
        }
        if (q.status === 'follow_up' && q.followUpDate) {
          const appointmentTime = new Date(q.followUpDate).getTime();
          if (now >= appointmentTime) {
            await updateDoc(doc(db, 'queues', q.id), {
              status: q.resolvedBy === 'staff' ? 'waiting_staff' : 'waiting_front',
              assignedStaffId: q.resolvedBy === 'staff' ? q.followUpStaffId : null,
              followUpDate: null, 
              isFollowUpReturn: true, 
              createdAt: now 
            });
          }
        }
      });
    }, 5000); 
    return () => clearInterval(interval);
  }, [queues, isAdminLoggedIn, loggedInFrontId, loggedInStaffId]);

  // --- ACTIONS ---
  const handleCreateTicket = async (ticketData) => {
    const { topicId, branch, userType, studentId, details } = ticketData;
    const ticketId = `Q${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const newTicket = {
      topicId, branch, userType, studentId, details,
      status: 'waiting_front', frontDeskId: null, assignedStaffId: null, resolvedBy: null, 
      createdAt: Date.now(), calledAt: null, feedback: null, isFollowUpReturn: false
    };
    try {
      await setDoc(doc(db, 'queues', ticketId), newTicket);
      navigate(`/ticket/${ticketId}`);
    } catch(err) {
      console.error(err);
    }
  };

  const handleFrontCallNext = async (frontId) => {
    const frontQueues = queues.filter(q => q.status === 'waiting_front').sort((a, b) => a.createdAt - b.createdAt);
    if (frontQueues.length > 0) {
      await updateDoc(doc(db, 'queues', frontQueues[0].id), {
        status: 'serving_front', frontDeskId: frontId, calledAt: Date.now()
      });
    }
  };

  const handleFrontResolve = async (ticketId) => {
    await updateDoc(doc(db, 'queues', ticketId), { status: 'completed', resolvedBy: 'frontdesk' });
  };

  const handleForwardToStaff = async (ticketId, staffId) => {
    await updateDoc(doc(db, 'queues', ticketId), {
      status: 'waiting_staff', assignedStaffId: staffId, calledAt: null
    });
  };

  const handleStaffCallNext = async (staffId) => {
    const staffQueues = queues.filter(q => q.assignedStaffId === staffId && q.status === 'waiting_staff').sort((a, b) => a.createdAt - b.createdAt);
    if (staffQueues.length > 0) {
      await updateDoc(doc(db, 'queues', staffQueues[0].id), {
        status: 'serving_staff', calledAt: Date.now()
      });
    }
  };

  const handleStaffResolve = async (ticketId) => {
    await updateDoc(doc(db, 'queues', ticketId), { status: 'completed', resolvedBy: 'staff' });
  };

  const handleFollowUpTicket = async (ticketId, note, date, role, staffId) => {
    await updateDoc(doc(db, 'queues', ticketId), {
      status: 'follow_up', followUpNote: note, followUpDate: date, resolvedBy: role, followUpStaffId: staffId
    });
  };

  const handleMissedTicket = async (ticketId) => {
    await updateDoc(doc(db, 'queues', ticketId), { status: 'missed' });
  };

  const handleFeedback = async (ticketId, rating) => {
    await updateDoc(doc(db, 'queues', ticketId), { feedback: rating });
    setTimeout(() => { navigate('/'); }, 1500);
  };

  return (
    <>
      {/* 🌐 ปุ่มเปลี่ยนภาษา (Floating Button แทนแถบ Nav เดิม) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setLang(lang === 'th' ? 'en' : 'th')} 
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 shadow-2xl px-5 py-3 rounded-full font-bold text-white transition-transform active:scale-95"
        >
          <Globe size={20} className="text-blue-300" /> {lang === 'th' ? 'ENG' : 'THAI'}
        </button>
      </div>

      <div className="flex-grow flex flex-col relative overflow-hidden bg-gray-50">
        <Routes>
          <Route path="/" element={<KioskHome onEnter={() => navigate('/form')} lang={lang} t={t} />} />
          <Route path="/form" element={<StudentForm onSubmit={handleCreateTicket} onBack={() => navigate('/')} lang={lang} t={t} />} />
          <Route path="/ticket/:ticketId" element={<TicketViewWrapper queues={queues} onFeedback={handleFeedback} staff={staff} lang={lang} t={t} />} />
          <Route path="/monitor" element={<MonitorScreen queues={queues} staff={staff} lang={lang} t={t} />} />
          
          <Route path="/frontdesk/login" element={<RoleLogin role="frontdesk" staff={staff} onLogin={(id) => { setLoggedInFrontId(id); navigate('/frontdesk'); }} title={`Front Desk ${t.loginTo}`} lang={lang} t={t} />} />
          <Route path="/frontdesk" element={
            <ProtectedRoute isAllowed={!!loggedInFrontId} redirectPath="/frontdesk/login">
              <FrontDeskPanel staffId={loggedInFrontId} staffData={staff.find(s => s.id === loggedInFrontId)} allStaff={staff} queues={queues} onCallNext={() => handleFrontCallNext(loggedInFrontId)} onResolve={handleFrontResolve} onForward={handleForwardToStaff} onFollowUp={(ticketId, note, date) => handleFollowUpTicket(ticketId, note, date, 'frontdesk', loggedInFrontId)} onMissed={handleMissedTicket} onLogout={() => { setLoggedInFrontId(null); navigate('/frontdesk/login'); }} lang={lang} t={t} /> 
            </ProtectedRoute>
          } />

          <Route path="/staff/login" element={<RoleLogin role="specialist" staff={staff} onLogin={(id) => { setLoggedInStaffId(id); navigate('/staff'); }} title={`Specialist ${t.loginTo}`} lang={lang} t={t} />} />
          <Route path="/staff" element={
            <ProtectedRoute isAllowed={!!loggedInStaffId} redirectPath="/staff/login">
              <StaffPanel staffId={loggedInStaffId} staffData={staff.find(s => s.id === loggedInStaffId)} queues={queues} onCallNext={() => handleStaffCallNext(loggedInStaffId)} onResolve={handleStaffResolve} onFollowUp={(ticketId, note, date) => handleFollowUpTicket(ticketId, note, date, 'staff', loggedInStaffId)} onMissed={handleMissedTicket} onLogout={() => { setLoggedInStaffId(null); navigate('/staff/login'); }} lang={lang} t={t} />
            </ProtectedRoute>
          } />

          <Route path="/admin/login" element={<AdminLogin onLogin={() => { setIsAdminLoggedIn(true); navigate('/admin'); }} t={t} />} />
          <Route path="/admin" element={
            <ProtectedRoute isAllowed={isAdminLoggedIn} redirectPath="/admin/login">
              <AdminPanel queues={queues} staff={staff} onLogout={() => { setIsAdminLoggedIn(false); navigate('/admin/login'); }} lang={lang} t={t} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

function TicketViewWrapper({ queues, onFeedback, staff, lang, t }) {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  return <StudentView ticketId={ticketId} queues={queues} onFeedback={handleFeedback} onNewTicket={() => navigate('/')} staff={staff} lang={lang} t={t} />;
}

// ============================================================================
// COMPONENTS ย่อย
// ============================================================================

function KioskHome({ onEnter, t }) {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="inline-block p-6 bg-white rounded-3xl shadow-xl border border-blue-100 mb-4 animate-bounce">
          <QrCode size={100} className="text-blue-600" />
        </div>
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">{t.kioskTitle}</h1>
        <p className="text-gray-500 text-lg whitespace-pre-line">{t.kioskDesc}</p>
        <button onClick={onEnter} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-2xl text-2xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-transform active:scale-95 flex items-center justify-center gap-3">
          {t.kioskBtn} <ArrowRight size={28} />
        </button>
      </div>
    </div>
  );
}

function StudentForm({ onSubmit, onBack, lang, t }) {
  const [userType, setUserType] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [topic, setTopic] = useState('');
  const [branch, setBranch] = useState('');
  const [details, setDetails] = useState('');

  const isStudent = userType === 'student';
  const showStudentId = ['student', 'parent'].includes(userType);
  
  const isFormValid = topic && (!isStudent || studentId.trim() !== '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) onSubmit({ topicId: topic, branch: branch || null, userType, studentId: showStudentId ? studentId.trim() : null, details: details.trim() });
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-50 pt-20">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 sm:p-8">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1 font-medium">
          &larr; {t.backToHome}
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">{t.formTitle}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">{t.q1}</label>
            <div className="grid grid-cols-3 gap-3">
              <button type="button" onClick={() => setUserType('student')} className={`py-3 px-2 border-2 rounded-xl text-sm font-bold flex flex-col items-center gap-2 transition-all ${userType === 'student' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}>
                <GraduationCap size={24} /> {t.student}
              </button>
              <button type="button" onClick={() => setUserType('parent')} className={`py-3 px-2 border-2 rounded-xl text-sm font-bold flex flex-col items-center gap-2 transition-all ${userType === 'parent' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}>
                <Users size={24} /> {t.parent}
              </button>
              <button type="button" onClick={() => { setUserType('external'); setStudentId(''); }} className={`py-3 px-2 border-2 rounded-xl text-sm font-bold flex flex-col items-center gap-2 transition-all ${userType === 'external' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}>
                <Briefcase size={24} /> {t.external}
              </button>
            </div>
          </div>

          {showStudentId && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {t.q2} {userType === 'parent' && <span className="text-gray-400 font-normal ml-1">{t.optional}</span>}
              </label>
              <input type="text" required={isStudent} value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-lg transition-all" placeholder={userType === 'parent' ? t.placeholderParentId : t.placeholderId} />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">{t.q3}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TOPICS.map(topicItem => (
                <button type="button" key={topicItem.id} onClick={() => { setTopic(topicItem.id); setBranch(''); }} className={`p-4 border-2 rounded-xl text-sm font-bold text-left transition-all ${topic === topicItem.id ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-gray-100 text-gray-600 hover:border-gray-300'}`}>
                  {lang === 'th' ? topicItem.name_th : topicItem.name_en}
                </button>
              ))}
            </div>
          </div>

          {topic === 'acad' && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-gray-700 mb-3">{t.selectBranch}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BRANCHES.map(b => (
                  <button type="button" key={b.id} onClick={() => setBranch(b.id)} className={`p-3 border-2 rounded-xl text-sm font-bold text-center transition-all ${branch === b.id ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-gray-100 text-gray-600 hover:border-gray-300'}`}>
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t.q4} <span className="text-gray-400 font-normal">{t.optionalFast}</span></label>
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows="3" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none resize-none transition-all" placeholder={t.placeholderDetails} />
          </div>

          <button type="submit" disabled={!isFormValid} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-5 rounded-xl text-xl shadow-lg transition-all mt-6">
            {t.confirmBtn}
          </button>
        </form>
      </div>
    </div>
  );
}

function StudentView({ ticketId, queues, onFeedback, onNewTicket, staff, lang, t }) {
  const [toast, setToast] = useState(null);
  const [hasNotifiedPre, setHasNotifiedPre] = useState(false);
  const [hasNotifiedTurn, setHasNotifiedTurn] = useState(false);
  
  const myTicket = queues.find(q => q.id === ticketId);

  if (!myTicket) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle size={64} className="text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">{t.notFoundTitle}</h2>
        <button onClick={onNewTicket} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold">{t.backToHome}</button>
      </div>
    );
  }

  if (myTicket.status === 'completed') {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-white text-center">
        <CheckCircle size={80} className="text-green-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.serviceCompleted}</h2>
        <p className="text-gray-500 mb-8">{t.thanksFeedback}</p>
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => onFeedback(ticketId, star)} className="p-2 text-gray-200 hover:text-yellow-400 hover:scale-110 transition-all">
              <Star size={48} fill="currentColor" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (myTicket.status === 'follow_up') {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-orange-50 text-center">
        <Calendar size={80} className="text-orange-500 mb-6" />
        <h2 className="text-3xl font-bold text-orange-800 mb-2">{t.followUpTitle}</h2>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 mt-4 mb-8 text-left max-w-sm w-full">
          <p className="text-sm text-gray-500 mb-1">{t.followUpTodo}</p>
          <p className="text-gray-800 font-medium mb-4">{myTicket.followUpNote || '-'}</p>
          {myTicket.followUpDate && (
            <>
              <p className="text-sm text-gray-500 mb-1">{t.followUpDate}</p>
              <p className="text-orange-600 font-bold">{new Date(myTicket.followUpDate).toLocaleString(lang === 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </>
          )}
          <p className="text-xs text-orange-400 mt-4 text-center">{t.autoRequeueNote}</p>
        </div>
        <button onClick={onNewTicket} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg">{t.backToHome}</button>
      </div>
    );
  }

  if (myTicket.status === 'missed') {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-red-50 text-center">
        <XCircle size={80} className="text-red-500 mb-6" />
        <h2 className="text-3xl font-bold text-red-800 mb-2">{t.missedTitle}</h2>
        <p className="text-red-600 mb-8">{t.missedDesc}</p>
        <button onClick={onNewTicket} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg">{t.getNewTicket}</button>
      </div>
    );
  }

  const topicName = getTopicName(myTicket.topicId, myTicket.branch, lang);
  
  const isServing = myTicket.status === 'serving_front' || myTicket.status === 'serving_staff';
  const isWaitingFront = myTicket.status === 'waiting_front';
  const isWaitingStaff = myTicket.status === 'waiting_staff';
  
  const myIndex = queues.findIndex(q => q.id === ticketId);
  let position = 0;
  if (isWaitingFront) position = queues.filter((q, idx) => q.status === 'waiting_front' && idx <= myIndex).length;
  else if (isWaitingStaff) position = queues.filter((q, idx) => q.assignedStaffId === myTicket.assignedStaffId && q.status === 'waiting_staff' && idx <= myIndex).length;
  
  const ewt = Math.max(1, position * 5); 

  useEffect(() => {
    if ((isWaitingFront || isWaitingStaff) && position === 3 && !hasNotifiedPre) {
      setToast(t.toastPrepare);
      setHasNotifiedPre(true);
      setTimeout(() => setToast(null), 5000);
    }
    if (isServing && !hasNotifiedTurn) {
      playNotifySound();
      setToast(t.toastTurn);
      setHasNotifiedTurn(true);
    }
  }, [isServing, isWaitingFront, isWaitingStaff, position, hasNotifiedPre, hasNotifiedTurn, t]);

  return (
    <div className="flex-grow flex flex-col bg-gray-100 p-4 sm:p-6 pb-20">
      {toast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-800 text-white px-6 py-4 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-bounce w-11/12 max-w-md">
          <Bell size={24} className="animate-pulse shrink-0 text-yellow-300" /> 
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-sm w-full mx-auto mt-4">
        <div className={`p-8 text-center text-white transition-colors duration-500 ${isServing ? 'bg-green-500 animate-pulse' : (isWaitingStaff ? 'bg-purple-600' : 'bg-blue-600')}`}>
          <h3 className="text-white/80 font-bold mb-2 tracking-wide uppercase text-sm">{t.queueNumber}</h3>
          <div className="text-7xl font-black tracking-wider my-2">{myTicket.id}</div>
          <div className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium mt-3 border border-white/30">{topicName}</div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
             <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">{t.contactPerson}</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-800 text-lg">{getUserTypeLabel(myTicket.userType, t)}</p>
                  {myTicket.studentId && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-blue-200">{myTicket.studentId}</span>}
                  {myTicket.isFollowUpReturn && <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-200">{t.appointmentTag}</span>}
                </div>
             </div>
          </div>

          {isWaitingFront && (
            <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-100">
              <p className="text-sm text-blue-600 font-bold mb-2">{t.waitFrontDesk}</p>
              <p className="text-4xl font-black text-blue-800">{position - 1} <span className="text-base font-medium">{t.queuesAhead}</span></p>
              <p className="text-xs text-blue-500 mt-2">{t.estTime}{ewt} {t.estMins}</p>
            </div>
          )}

          {isWaitingStaff && (
            <div className="bg-purple-50 rounded-2xl p-6 text-center border border-purple-100">
              <div className="flex justify-center mb-2"><Share size={24} className="text-purple-500"/></div>
              <p className="text-sm text-purple-600 font-bold mb-2">{t.forwardedToSpecialist}</p>
              <p className="text-xs text-purple-500 mb-2">{t.waitingFor} {staff.find(s=>s.id===myTicket.assignedStaffId)?.[lang==='th'?'name_th':'name_en']}</p>
              <p className="text-3xl font-black text-purple-800">{position - 1} <span className="text-base font-medium">{t.queuesAhead}</span></p>
            </div>
          )}

          {isServing && (
            <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-6 text-center shadow-inner">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
              <h4 className="text-2xl font-black text-green-800 mb-2">{t.yourTurn}</h4>
              <p className="text-green-700 font-medium">{t.pleaseProceed} <br/> <span className="font-bold text-lg">{staff.find(s=>s.id===(myTicket.frontDeskId || myTicket.assignedStaffId))?.[lang==='th'?'name_th':'name_en']}</span></p>
            </div>
          )}
        </div>
      </div>
      
      {(isWaitingFront || isWaitingStaff) && (
        <div className="text-center mt-6 text-gray-500 text-sm flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div> {t.liveUpdate}
        </div>
      )}
    </div>
  );
}

function MonitorScreen({ queues, staff, lang, t }) {
  const servingQueues = queues.filter(q => q.status === 'serving_front' || q.status === 'serving_staff').sort((a,b) => b.calledAt - a.calledAt); 
  const waitingFrontQueues = queues.filter(q => q.status === 'waiting_front').sort((a, b) => a.createdAt - b.createdAt);

  return (
    <div className="flex-grow flex bg-slate-900 text-white h-screen overflow-hidden">
      <div className="w-2/3 p-6 flex flex-col border-r border-slate-700">
        <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
          <h1 className="text-4xl font-black flex items-center gap-3"><Monitor className="text-blue-400" size={40}/> {t.nowServing}</h1>
          <div className="text-xl font-bold text-slate-400">{new Date().toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-US')}</div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-grow overflow-y-auto pr-2 pb-20">
          {servingQueues.slice(0,6).map((q) => {
            const counterName = staff.find(s => s.id === (q.frontDeskId || q.assignedStaffId))?.[lang==='th'?'name_th':'name_en'] || 'Counter';
            const isNew = (Date.now() - q.calledAt) < 10000; 
            return (
              <div key={q.id} className={`rounded-3xl flex items-center p-6 border-l-[12px] shadow-2xl transition-all ${q.status === 'serving_staff' ? 'bg-slate-800 border-purple-500' : 'bg-slate-800 border-blue-500'} ${isNew ? 'animate-pulse ring-4 ring-white' : ''}`}>
                <div className="w-1/2">
                   <div className="text-7xl font-black tracking-wider text-white mb-2">{q.id}</div>
                   <div className="text-lg text-slate-400 font-medium flex items-center gap-2">
                     {getUserTypeLabel(q.userType, t)}
                     {q.isFollowUpReturn && <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded border border-orange-500/50">{t.appointmentTag}</span>}
                   </div>
                </div>
                <div className="w-1/2 text-right">
                   <div className="text-xl text-slate-400 font-bold mb-1">{t.proceedTo}</div>
                   <div className="text-3xl font-bold text-yellow-400">{counterName}</div>
                </div>
              </div>
            )
          })}
          {servingQueues.length === 0 && (
            <div className="col-span-1 xl:col-span-2 flex items-center justify-center h-full">
              <h2 className="text-4xl font-bold text-slate-600">{t.noServingQueue}</h2>
            </div>
          )}
        </div>
      </div>

      <div className="w-1/3 p-6 flex flex-col bg-slate-800/30">
        <div className="mb-6 border-b border-slate-700 pb-4">
          <h2 className="text-2xl font-black text-teal-400">{t.waitingQueue}</h2>
          <p className="text-sm text-slate-400 mt-1">{t.totalQueues} {waitingFrontQueues.length}</p>
        </div>
        <div className="overflow-y-auto pr-2 pb-20 space-y-3">
          {waitingFrontQueues.map((q, idx) => (
            <div key={q.id} className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center border border-slate-700">
              <div className="flex items-center gap-4">
                <span className="text-teal-400 font-black text-xl">#{idx + 1}</span>
                <span className="text-3xl font-bold text-white tracking-widest">{q.id}</span>
              </div>
              {q.isFollowUpReturn && <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded border border-orange-500/50">{t.appointmentTag}</span>}
            </div>
          ))}
          {waitingFrontQueues.length === 0 && (
            <div className="text-center text-slate-500 mt-10">{t.noWaitingQueue}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleLogin({ role, staff, onLogin, title, lang, t }) {
  const eligibleStaff = staff.filter(s => s.role === role);
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 bg-slate-100">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
          <Users className={role === 'frontdesk' ? 'text-teal-600' : 'text-blue-600'}/> {title}
        </h2>
        <div className="space-y-3">
          {eligibleStaff.map(s => (
            <button key={s.id} onClick={() => onLogin(s.id)} className={`w-full text-left p-5 border-2 rounded-2xl transition-all hover:-translate-y-1 ${role === 'frontdesk' ? 'border-teal-100 hover:border-teal-400 hover:bg-teal-50' : 'border-blue-100 hover:border-blue-400 hover:bg-blue-50'}`}>
              <div className="font-bold text-slate-800 text-lg">{lang === 'th' ? s.name_th : s.name_en}</div>
              {s.skills && s.skills.length > 0 && <div className="text-xs text-slate-500 mt-2 bg-white px-2 py-1 inline-block rounded border">{t.skills} {s.skills.join(', ')}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FrontDeskPanel({ staffId, staffData, allStaff, queues, onCallNext, onResolve, onForward, onFollowUp, onMissed, onLogout, lang, t }) {
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpNote, setFollowUpNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const myWaitingQueues = queues.filter(q => q.status === 'waiting_front').sort((a, b) => a.createdAt - b.createdAt);
  const currentServing = queues.find(q => q.frontDeskId === staffId && q.status === 'serving_front');
  const specialists = allStaff.filter(s => s.role === 'specialist');

  return (
    <div className="flex-grow flex flex-col bg-slate-50">
      <div className="bg-teal-900 text-white p-4 sm:p-6 flex justify-between items-center shadow-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-wide">{lang === 'th' ? staffData?.name_th : staffData?.name_en}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-teal-100 font-medium">{t.waitScreening} {myWaitingQueues.length} {t.queues}</span>
          </div>
        </div>
        <button onClick={onLogout} className="text-teal-100 hover:text-white flex items-center gap-2 bg-teal-800 px-4 py-2 rounded-xl transition-colors">
          <LogOut size={18} /> {t.logout}
        </button>
      </div>

      <div className="flex-grow p-4 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {currentServing ? (
            <div className="bg-white rounded-3xl shadow-xl border-t-8 border-teal-500 p-8 flex flex-col items-center">
              <div className="w-full flex justify-between items-start mb-6 border-b pb-4">
                <div>
                   <div className="text-teal-600 font-bold uppercase tracking-wider mb-1">{t.screeningQueue}</div>
                   <div className="text-7xl font-black text-slate-800 flex items-center gap-4">
                      {currentServing.id}
                      {currentServing.isFollowUpReturn && <span className="bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-full border border-orange-200">{t.appointmentTag}</span>}
                   </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-700 bg-slate-100 px-4 py-1.5 rounded-lg mb-2">{getUserTypeLabel(currentServing.userType, t)} {currentServing.studentId && `(${currentServing.studentId})`}</div>
                  <div className="text-sm font-medium text-slate-500">{getTopicName(currentServing.topicId, currentServing.branch, lang)}</div>
                </div>
              </div>

              {currentServing.details && (
                <div className="w-full bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-8 text-left">
                  <div className="flex items-center gap-2 font-bold text-yellow-800 mb-1"><FileText size={18}/> {t.detailsFromUser}</div>
                  <p className="text-yellow-900">{currentServing.details}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
                <button onClick={() => onResolve(currentServing.id)} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <CheckCircle size={24} /> {t.resolveHere}
                </button>
                <button onClick={() => setShowForwardModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <Share size={24} /> {t.forwardSpec}
                </button>
                <button onClick={() => { setFollowUpNote(''); setFollowUpDate(''); setShowFollowUpModal(true); }} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <Calendar size={24} /> {t.makeAppt}
                </button>
                <button onClick={() => onMissed(currentServing.id)} className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <XCircle size={24} /> {t.noShow}
                </button>
              </div>

              {/* Modals */}
              {showFollowUpModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                  <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl">
                    <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><Calendar className="text-orange-500"/> {t.followUpTitle} ({currentServing.id})</h3>
                    <div className="space-y-4 mb-6 text-left">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t.apptDetails}</label>
                        <textarea value={followUpNote} onChange={(e) => setFollowUpNote(e.target.value)} rows="3" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none"></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t.apptDate}</label>
                        <input type="datetime-local" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                        <p className="text-xs text-orange-500 mt-2">{t.autoRequeueNote}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => { onFollowUp(currentServing.id, followUpNote, followUpDate); setShowFollowUpModal(false); }} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl">{t.saveAppt}</button>
                      <button onClick={() => setShowFollowUpModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-xl">{t.cancel}</button>
                    </div>
                  </div>
                </div>
              )}

              {showForwardModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                  <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
                    <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><Share className="text-purple-600"/> {t.forwardSpec} ({currentServing.id})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {specialists.map(s => {
                        const sLoad = queues.filter(q => q.assignedStaffId === s.id && q.status === 'waiting_staff').length;
                        const isMatch = s.skills.includes(currentServing.topicId);
                        return (
                          <button key={s.id} onClick={() => { onForward(currentServing.id, s.id); setShowForwardModal(false); }}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${isMatch ? 'border-purple-200 bg-purple-50 hover:border-purple-500' : 'border-slate-100 hover:bg-slate-50 opacity-60'}`}>
                            <div className="font-bold text-slate-800 text-lg">{lang === 'th' ? s.name_th : s.name_en}</div>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-xs bg-white border px-2 py-1 rounded text-slate-500">{t.skills} {s.skills.join(',')}</span>
                              <span className={`text-sm font-bold px-2 py-1 rounded ${sLoad === 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>WAIT {sLoad}</span>
                            </div>
                            {isMatch && <div className="text-xs text-purple-600 font-bold mt-2">{t.matchTopic}</div>}
                          </button>
                        )
                      })}
                    </div>
                    <button onClick={() => setShowForwardModal(false)} className="w-full py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">{t.cancel}</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-12 flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-teal-200">
              <Users size={80} className="text-teal-100 mb-6" />
              <button onClick={onCallNext} disabled={myWaitingQueues.length === 0} className="w-full max-w-md bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-black py-8 rounded-2xl text-3xl shadow-[0_10px_20px_rgba(13,148,136,0.3)] transition-transform active:scale-95 flex items-center justify-center gap-3">
                <Play fill="currentColor" size={32}/> {t.callNext}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
          <div className="bg-slate-50 p-5 border-b border-slate-200 font-black text-slate-700 flex justify-between items-center">
            {t.waitingQueue} <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-lg text-sm">{myWaitingQueues.length}</span>
          </div>
          <div className="overflow-y-auto p-3 space-y-2">
            {myWaitingQueues.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-black text-teal-300">#{idx + 1}</div>
                  <div>
                    <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
                      {q.id}
                      {q.isFollowUpReturn && <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded border border-orange-200">{t.appointmentTag}</span>}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{getTopicName(q.topicId, q.branch, lang)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffPanel({ staffId, staffData, queues, onCallNext, onResolve, onFollowUp, onMissed, onLogout, lang, t }) {
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpNote, setFollowUpNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const myWaitingQueues = queues.filter(q => q.assignedStaffId === staffId && q.status === 'waiting_staff').sort((a, b) => a.createdAt - b.createdAt);
  const currentServing = queues.find(q => q.assignedStaffId === staffId && q.status === 'serving_staff');

  return (
    <div className="flex-grow flex flex-col bg-slate-50">
      <div className="bg-blue-900 text-white p-4 sm:p-6 flex justify-between items-center shadow-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-wide">{lang === 'th' ? staffData?.name_th : staffData?.name_en}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-blue-100 font-medium">{t.waitScreening} {myWaitingQueues.length} {t.queues}</span>
          </div>
        </div>
        <button onClick={onLogout} className="text-blue-100 hover:text-white flex items-center gap-2 bg-blue-800 px-4 py-2 rounded-xl transition-colors">
          <LogOut size={18} /> {t.logout}
        </button>
      </div>

      <div className="flex-grow p-4 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {currentServing ? (
            <div className="bg-white rounded-3xl shadow-xl border-t-8 border-blue-500 p-8 flex flex-col items-center">
              <div className="w-full flex justify-between items-start mb-6 border-b pb-4">
                <div>
                   <div className="text-blue-600 font-bold uppercase tracking-wider mb-1">{t.forwardedQueue}</div>
                   <div className="text-7xl font-black text-slate-800 flex items-center gap-4">
                     {currentServing.id}
                     {currentServing.isFollowUpReturn && <span className="bg-orange-100 text-orange-600 text-sm px-3 py-1 rounded-full border border-orange-200">{t.appointmentTag}</span>}
                   </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-700 bg-slate-100 px-4 py-1.5 rounded-lg mb-2">{getUserTypeLabel(currentServing.userType, t)} {currentServing.studentId && `(${currentServing.studentId})`}</div>
                </div>
              </div>

              {currentServing.details && (
                <div className="w-full bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-8 text-left">
                  <div className="flex items-center gap-2 font-bold text-yellow-800 mb-1"><FileText size={18}/> {t.detailsFromUser}</div>
                  <p className="text-yellow-900">{currentServing.details}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-4">
                <button onClick={() => onResolve(currentServing.id)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <CheckCircle size={24} /> {t.serviceCompleted}
                </button>
                <button onClick={() => { setFollowUpNote(''); setFollowUpDate(''); setShowFollowUpModal(true); }} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl text-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <Calendar size={24} /> {t.makeAppt}
                </button>
                <button onClick={() => onMissed(currentServing.id)} className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                  <XCircle size={24} /> {t.noShow}
                </button>
              </div>

              {/* Follow Up Modal */}
              {showFollowUpModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                  <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl">
                    <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><Calendar className="text-orange-500"/> {t.followUpTitle} ({currentServing.id})</h3>
                    <div className="space-y-4 mb-6 text-left">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t.apptDetails}</label>
                        <textarea value={followUpNote} onChange={(e) => setFollowUpNote(e.target.value)} rows="3" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none"></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t.apptDate}</label>
                        <input type="datetime-local" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                        <p className="text-xs text-orange-500 mt-2">{t.autoRequeueNote}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => { onFollowUp(currentServing.id, followUpNote, followUpDate); setShowFollowUpModal(false); }} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl">{t.saveAppt}</button>
                      <button onClick={() => setShowFollowUpModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-xl">{t.cancel}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-12 flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-blue-200">
              <CheckCircle size={80} className="text-blue-100 mb-6" />
              <button onClick={onCallNext} disabled={myWaitingQueues.length === 0} className="w-full max-w-md bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black py-8 rounded-2xl text-3xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-3">
                <Play fill="currentColor" size={32}/> {t.callNext}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
          <div className="bg-slate-50 p-5 border-b border-slate-200 font-black text-slate-700 flex justify-between items-center">
            {t.yourQueue} <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm">{myWaitingQueues.length}</span>
          </div>
          <div className="overflow-y-auto p-3 space-y-2">
            {myWaitingQueues.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-black text-blue-300">#{idx + 1}</div>
                  <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    {q.id}
                    {q.isFollowUpReturn && <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded border border-orange-200">{t.appointmentTag}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin, t }) {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 bg-slate-100">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
        <Lock size={48} className="mx-auto text-purple-600 mb-4" />
        <h2 className="text-2xl font-black text-slate-800 mb-6">Admin Panel</h2>
        <button onClick={onLogin} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all">{t.loginTo}</button>
      </div>
    </div>
  );
}

function AdminPanel({ queues, staff, onLogout, lang, t }) {
  const completedQueues = queues.filter(q => q.status === 'completed');
  const resolvedByFront = completedQueues.filter(q => q.resolvedBy === 'frontdesk').length;
  const resolvedByStaff = completedQueues.filter(q => q.resolvedBy === 'staff').length;
  const followUpQueues = queues.filter(q => q.status === 'follow_up').length;

  return (
    <div className="flex-grow bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3"><BarChart className="text-purple-600"/> {t.dashboard}</h1>
          <button onClick={onLogout} className="text-slate-600 bg-slate-200 px-4 py-2 rounded-lg font-bold hover:bg-slate-300">{t.logout}</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="text-slate-500 font-bold mb-2">{t.totalSystem}</div>
            <div className="text-5xl font-black text-slate-800">{queues.length}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="text-teal-600 font-bold mb-2">{t.resolvedFront}</div>
            <div className="text-5xl font-black text-teal-600">{resolvedByFront}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="text-purple-600 font-bold mb-2">{t.resolvedSpec}</div>
            <div className="text-5xl font-black text-purple-600">{resolvedByStaff}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="text-orange-500 font-bold mb-2">{t.pendingAppt}</div>
            <div className="text-5xl font-black text-orange-500">{followUpQueues}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="text-amber-500 font-bold mb-2">{t.stuckSys}</div>
            <div className="text-5xl font-black text-amber-500">{queues.filter(q=>['waiting_front','serving_front','waiting_staff','serving_staff'].includes(q.status)).length}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-800 text-white p-4 font-bold text-lg">{t.liveDb}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-sm">
                  <th className="p-4 border-b">Queue</th>
                  <th className="p-4 border-b">Contact</th>
                  <th className="p-4 border-b">Details/Notes</th>
                  <th className="p-4 border-b">Topic</th>
                  <th className="p-4 border-b">Resolved By</th>
                  <th className="p-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {queues.slice().reverse().map(q => (
                  <tr key={q.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-black">
                      {q.id}
                      {q.isFollowUpReturn && <div className="text-orange-500 text-[10px] mt-1">{t.appointmentTag}</div>}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-700">{getUserTypeLabel(q.userType, t)}</div>
                      {q.studentId && <div className="text-xs text-blue-600 font-bold">{q.studentId}</div>}
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-500 text-sm" title={q.details}>{q.details || '-'}</td>
                    <td className="p-4 text-slate-600 font-medium">{getTopicName(q.topicId, q.branch, lang)}</td>
                    <td className="p-4 text-sm font-bold">
                       {q.resolvedBy === 'frontdesk' ? <span className="text-teal-600">Front Desk</span> : 
                        q.resolvedBy === 'staff' ? <span className="text-purple-600">Specialist Staff</span> : '-'}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold
                        ${q.status.includes('waiting') ? 'bg-amber-100 text-amber-700' : ''}
                        ${q.status.includes('serving') ? 'bg-blue-100 text-blue-700' : ''}
                        ${q.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                        ${q.status === 'follow_up' ? 'bg-orange-100 text-orange-700' : ''}
                        ${q.status === 'missed' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {q.status.toUpperCase().replace('_', ' ')}
                      </span>
                      {q.status === 'follow_up' && (
                        <div className="text-xs text-orange-600 mt-1 max-w-xs truncate" title={q.followUpNote}>
                          {q.followUpDate ? new Date(q.followUpDate).toLocaleString(lang==='th'?'th-TH':'en-US',{dateStyle: 'short', timeStyle: 'short'}) : ''}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}