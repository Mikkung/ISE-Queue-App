import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { 
  User, Clock, CheckCircle, XCircle, Star, Bell, 
  Settings, Users, QrCode, ArrowRight, Play, LogOut, AlertTriangle, GraduationCap, Briefcase, Lock, Monitor, Share, FileText, BarChart, Calendar, Globe, Download
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
    thanksFeedback: "ขอบคุณที่ใช้บริการ โปรดให้คะแนนความพึงพอใจด้านล่าง",
    commentPlaceholder: "มีข้อเสนอแนะเพิ่มเติมไหมครับ? (ไม่บังคับ)",
    submitFeedback: "ส่งแบบประเมิน",
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
    online: "พร้อมรับคิว",
    offline: "พักเบรก",
    loginTitle: "เข้าสู่ระบบบุคลากร",
    emailLabel: "อีเมล (Email)",
    passwordLabel: "รหัสผ่าน (Password)",
    exportBtn: "ส่งออกข้อมูล CSV",
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
    commentPlaceholder: "Any additional feedback? (Optional)",
    submitFeedback: "Submit Feedback",
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
    loginTo: "Login",
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
    online: "Online",
    offline: "Break",
    loginTitle: "Staff Login",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    exportBtn: "Export CSV",
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

// 🔥 เพิ่มระบบ Email และ Password พื้นฐานให้กับพนักงานแต่ละคน
const INITIAL_STAFF = [
  { id: 'fd1', name_th: 'Front Desk 1', name_en: 'Front Desk 1', role: 'frontdesk', skills: [], isReady: true, email: 'Phachphicha.p@chula.ac.th', password: 'ise1234' },
  { id: 'fd2', name_th: 'Front Desk 2', name_en: 'Front Desk 2', role: 'frontdesk', skills: [], isReady: false, email: 'fd2@ise.com', password: 'ise1234' },
  { id: 's1', name_th: 'Napassorn - Academic (NANO)', name_en: 'Napassorn - Academic (NANO)', role: 'specialist', skills: ['acad'], isReady: true, email: 'napassorn.p@chula.ac.th', password: 'ise1234' },
  { id: 's2', name_th: 'Nat - Academic (ICE)', name_en: 'Nat - Academic (ICE)', role: 'specialist', skills: ['acad'], isReady: true, email: 'Nat.s@chula.ac.th', password: 'ise1234' },
  { id: 's3', name_th: 'Dolaporn - Academic (Robo)', name_en: 'Dolaporn - Academic (Robo)', role: 'specialist', skills: ['acad'], isReady: true, email: 'Dolaporn.a@chula.ac.th', password: 'ise1234' },
  { id: 's4', name_th: 'Nichayanuch - Academic (ADME)', name_en: 'Nichayanuch - Academic (ADME)', role: 'specialist', skills: ['acad'], isReady: true, email: 'nichayanuch.l@chula.ac.th', password: 'ise1234' },
  { id: 's5', name_th: 'Sittipun - Academic (AERO)', name_en: 'Sittipun - Academic (AERO)', role: 'specialist', skills: ['acad'], isReady: true, email: 'sittipun.w@chula.ac.th', password: '1234' },
  { id: 's6', name_th: 'Panyata - Academic', name_en: 'Panyata - Academic', role: 'specialist', skills: ['acad'], isReady: true, email: 'Panyata.S@chula.ac.th', password: 'ise1234' },
  { id: 's7', name_th: 'Suputtra - Academic', name_en: 'Suputtra - Academic', role: 'specialist', skills: ['acad','admin'], isReady: true, email: 'suputtra.d@chula.ac.th', password: 'ise1234' },
  { id: 's8', name_th: 'Punsita - Academic', name_en: 'Punsita - Academic', role: 'specialist', skills: ['admin','inter'], isReady: true, email: 'punsita.b@chula.ac.th', password: 'ise1234' },
  { id: 's9', name_th: 'Fonthong - Inter', name_en: 'Fonthong - Inter', role: 'specialist', skills: ['admin','inter'], isReady: true, email: 'fonthong.t@chula.ac.th', password: 'ise1234' },
  { id: 's10', name_th: 'Jirachaya - Inter', name_en: 'Jirachaya - Inter', role: 'specialist', skills: ['admin','inter'], isReady: true, email: 'Jirachaya.so@chula.ac.th', password: 'ise1234' },
  { id: 's11', name_th: 'Supaphan - Fin/Procure', name_en: 'Supaphan - Fin/Procure', role: 'specialist', skills: ['fin'], isReady: true, email: 'supaphan.p@chula.ac.th', password: 'ise1234' },
  { id: 's12', name_th: 'Sawarach - Procure', name_en: 'Sawarach - Procure', role: 'specialist', skills: ['fin'], isReady: true, email: 'sawarach.s@chula.ac.th', password: 'ise1234' },
  { id: 's13', name_th: 'Jirasaya - Fin', name_en: 'Jirasaya - Fin', role: 'specialist', skills: ['fin'], isReady: true, email: 'jirasaya.c@chula.ac.th', password: 'ise1234' },
  { id: 's14', name_th: 'Pamigar - Sa', name_en: 'Pamigar - Sa', role: 'specialist', skills: ['sa'], isReady: true, email: 'pamigar.m@chula.ac.th', password: 'ise1234' },
  { id: 's15', name_th: 'Waranya - Sa', name_en: 'Waranya - Sa', role: 'specialist', skills: ['sa'], isReady: true, email: 'waranya.ph@chula.ac.th', password: 'ise1234' },
  { id: 's18', name_th: 'Staff C (All-rounder)', name_en: 'Staff C (All-rounder)', role: 'specialist', skills: ['acad', 'fin', 'sa', 'inter', 'admin'], isReady: false, email: 's18@ise.com', password: '1234' },
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

const ProtectedRoute = ({ isAllowed, redirectPath = '/login', children }) => {
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
      console.error("Firebase connection error:", err);
    }
  }, []);

  useEffect(() => {
    try {
      const staffQuery = query(collection(db, 'staffs'));
      const unsubscribeStaff = onSnapshot(staffQuery, (snapshot) => {
        if (snapshot.empty) {
          INITIAL_STAFF.forEach(async (s) => {
            await setDoc(doc(db, 'staffs', s.id), s);
          });
        } else {
          const staffData = [];
          snapshot.forEach((doc) => staffData.push({ id: doc.id, ...doc.data() }));
          
          staffData.sort((a, b) => {
            if (a.isReady === b.isReady) return 0;
            return a.isReady ? -1 : 1;
          });

          setStaff(staffData);
        }
      });
      return () => unsubscribeStaff();
    } catch(err) {}
  }, []);

  useEffect(() => {
    if (!isAdminLoggedIn && !loggedInFrontId && !loggedInStaffId) return;
    const interval = setInterval(() => {
      const now = Date.now();
      queues.forEach(async (q) => {
        try {
          if (q.status?.includes('serving') && q.calledAt && (now - q.calledAt > TIMEOUT_MS)) {
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
        } catch(e) {}
      });
    }, 5000); 
    return () => clearInterval(interval);
  }, [queues, isAdminLoggedIn, loggedInFrontId, loggedInStaffId]);

  const handleCreateTicket = async (ticketData) => {
    const { topicId, branch, userType, studentId, details } = ticketData;
    const ticketId = `Q${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const newTicket = {
      topicId, branch, userType, studentId, details,
      status: 'waiting_front', frontDeskId: null, assignedStaffId: null, resolvedBy: null, 
      createdAt: Date.now(), calledAt: null, feedback: null, feedbackComment: null, isFollowUpReturn: false
    };
    
    await setDoc(doc(db, 'queues', ticketId), newTicket);
    navigate(`/ticket/${ticketId}`);
  };

  // 🔥 ลบคำสั่ง alert() ออก ป้องกันเบราว์เซอร์มือถือบล็อกแล้วหน้าค้าง
  const safeFirebaseUpdate = async (updateFn) => {
    try { await updateFn(); } 
    catch (err) { console.error("Firebase Action Error:", err); }
  }

  const handleToggleReady = (staffId, currentStatus) => safeFirebaseUpdate(async () => {
    await updateDoc(doc(db, 'staffs', staffId), { isReady: !currentStatus });
  });

  const handleFrontCallNext = (frontId) => safeFirebaseUpdate(async () => {
    const frontQueues = queues.filter(q => q.status === 'waiting_front').sort((a, b) => a.createdAt - b.createdAt);
    if (frontQueues.length > 0) {
      await updateDoc(doc(db, 'queues', frontQueues[0].id), {
        status: 'serving_front', frontDeskId: frontId, calledAt: Date.now()
      });
    }
  });

  const handleFrontResolve = (ticketId) => safeFirebaseUpdate(async () => {
    await updateDoc(doc(db, 'queues', ticketId), { status: 'completed', resolvedBy: 'frontdesk' });
  });

  const handleForwardToStaff = (ticketId, staffId) => safeFirebaseUpdate(async () => {
    await updateDoc(doc(db, 'queues', ticketId), {
      status: 'waiting_staff', assignedStaffId: staffId, calledAt: null
    });
  });

  const handleStaffCallNext = (staffId) => safeFirebaseUpdate(async () => {
    const staffQueues = queues.filter(q => q.assignedStaffId === staffId && q.status === 'waiting_staff').sort((a, b) => a.createdAt - b.createdAt);
    if (staffQueues.length > 0) {
      await updateDoc(doc(db, 'queues', staffQueues[0].id), {
        status: 'serving_staff', calledAt: Date.now()
      });
    }
  });

  const handleStaffResolve = (ticketId) => safeFirebaseUpdate(async () => {
    await updateDoc(doc(db, 'queues', ticketId), { status: 'completed', resolvedBy: 'staff' });
  });

  const handleFollowUpTicket = (ticketId, note, date, role, staffId) => safeFirebaseUpdate(async () => {
    await updateDoc(doc(db, 'queues', ticketId), {
      status: 'follow_up', followUpNote: note, followUpDate: date, resolvedBy: role, followUpStaffId: staffId
    });
  });

  const handleMissedTicket = (ticketId) => safeFirebaseUpdate(async () => {
    await updateDoc(doc(db, 'queues', ticketId), { status: 'missed' });
  });

  const handleFeedback = (ticketId, rating, comment) => safeFirebaseUpdate(async () => {
    await updateDoc(doc(db, 'queues', ticketId), { 
      feedback: rating,
      feedbackComment: comment || null
    });
    setTimeout(() => { navigate('/'); }, 1000);
  });

  const handleLogout = () => {
    setLoggedInFrontId(null);
    setLoggedInStaffId(null);
    setIsAdminLoggedIn(false);
    navigate('/login');
  };

  return (
    <>
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
          
          <Route path="/login" element={
            <UnifiedLogin 
              staff={staff} 
              onLoginFront={(id) => { setLoggedInFrontId(id); navigate('/frontdesk'); }}
              onLoginStaff={(id) => { setLoggedInStaffId(id); navigate('/staff'); }}
              onLoginAdmin={() => { setIsAdminLoggedIn(true); navigate('/admin'); }}
              t={t} 
            />
          } />

          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/frontdesk/login" element={<Navigate to="/login" replace />} />
          <Route path="/staff/login" element={<Navigate to="/login" replace />} />

          <Route path="/frontdesk" element={
            <ProtectedRoute isAllowed={!!loggedInFrontId} redirectPath="/login">
              <FrontDeskPanel staffId={loggedInFrontId} staffData={staff.find(s => s.id === loggedInFrontId)} allStaff={staff} queues={queues} onCallNext={() => handleFrontCallNext(loggedInFrontId)} onResolve={handleFrontResolve} onForward={handleForwardToStaff} onFollowUp={(ticketId, note, date) => handleFollowUpTicket(ticketId, note, date, 'frontdesk', loggedInFrontId)} onMissed={handleMissedTicket} onToggleReady={handleToggleReady} onLogout={handleLogout} lang={lang} t={t} /> 
            </ProtectedRoute>
          } />

          <Route path="/staff" element={
            <ProtectedRoute isAllowed={!!loggedInStaffId} redirectPath="/login">
              <StaffPanel staffId={loggedInStaffId} staffData={staff.find(s => s.id === loggedInStaffId)} queues={queues} onCallNext={() => handleStaffCallNext(loggedInStaffId)} onResolve={handleStaffResolve} onFollowUp={(ticketId, note, date) => handleFollowUpTicket(ticketId, note, date, 'staff', loggedInStaffId)} onMissed={handleMissedTicket} onToggleReady={handleToggleReady} onLogout={handleLogout} lang={lang} t={t} />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute isAllowed={isAdminLoggedIn} redirectPath="/login">
              <AdminPanel queues={queues} staff={staff} onLogout={handleLogout} lang={lang} t={t} />
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
  return <StudentView ticketId={ticketId} queues={queues} onFeedback={onFeedback} onNewTicket={() => navigate('/')} staff={staff} lang={lang} t={t} />;
}

// ============================================================================
// COMPONENTS ย่อย
// ============================================================================

function UnifiedLogin({ staff, onLoginFront, onLoginStaff, onLoginAdmin, t }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === 'thanaphon.admin@ise.com' && password === 'admin123') {
      onLoginAdmin();
      return;
    }

    const matchedStaff = staff.find(s => 
      s.email && s.email.toLowerCase() === normalizedEmail && s.password === password);
    if (matchedStaff) {
      if (matchedStaff.role === 'frontdesk') {
        onLoginFront(matchedStaff.id);
      } else {
        onLoginStaff(matchedStaff.id);
      }
    } else {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง (Invalid email or password)');
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 bg-slate-100">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <Lock size={40} />
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">{t.loginTitle}</h2>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t.emailLabel}</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
              placeholder="e.g., s1@ise.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t.passwordLabel}</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" 
              placeholder="••••••••" 
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-100">
              {error}
            </div>
          )}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 mt-4">
            {t.loginTo}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400 text-center">
          <p>Mock Accounts for Test:</p>
          <p>Admin: thanaphon.admin@ise.com / admin123</p>
          <p>Staff: napassorn.p@chula.ac.th / ise1234</p>
        </div>
      </div>
    </div>
  );
}

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
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const isStudent = userType === 'student';
  const showStudentId = ['student', 'parent'].includes(userType);
  
  const isFormValid = topic && (!isStudent || studentId.trim() !== '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        await onSubmit({ 
          topicId: topic, 
          branch: branch || null, 
          userType, 
          studentId: showStudentId ? studentId.trim() : null, 
          details: details.trim() 
        });
      } catch (err) {
        setSubmitError("เชื่อมต่อระบบล้มเหลว โปรดตรวจสอบการตั้งค่า Firebase API Key");
        setIsSubmitting(false);
      }
    }
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

          {submitError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mt-4 border border-red-200 flex items-start gap-2">
              <AlertTriangle size={20} className="shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <button type="submit" disabled={!isFormValid || isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-5 rounded-xl text-xl shadow-lg transition-all mt-6 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <><div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> กำลังประมวลผล...</>
            ) : (
              t.confirmBtn
            )}
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

  // 🔥 เพิ่ม State สำหรับให้คะแนน 1-5 และคอมเมนต์
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);
  
  const myTicket = queues.find(q => q.id === ticketId);

  // 🔥 ย้ายตัวแปรทั้งหมดมาเพื่อป้องกันการเข้าถึงค่าว่าง (Null pointer)
  const topicName = myTicket ? getTopicName(myTicket.topicId, myTicket.branch, lang) : '';
  const isServing = myTicket?.status === 'serving_front' || myTicket?.status === 'serving_staff';
  const isWaitingFront = myTicket?.status === 'waiting_front';
  const isWaitingStaff = myTicket?.status === 'waiting_staff';
  
  const myIndex = queues.findIndex(q => q.id === ticketId);
  let position = 0;
  if (isWaitingFront) {
    position = queues.filter((q, idx) => q.status === 'waiting_front' && idx <= myIndex).length;
  } else if (isWaitingStaff && myTicket) {
    position = queues.filter((q, idx) => q.assignedStaffId === myTicket.assignedStaffId && q.status === 'waiting_staff' && idx <= myIndex).length;
  }
  
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

  // 🔥 กรณีไม่พบ Ticket ในระบบ
  if (!myTicket) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle size={64} className="text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">{t.notFoundTitle}</h2>
        <button onClick={onNewTicket} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold">{t.backToHome}</button>
      </div>
    );
  }

  // 🔥 หน้าจอประเมินความพึงพอใจ (แก้ไขบั๊กและเปลี่ยนเป็นปุ่มตัวเลขแล้ว)
  if (myTicket.status === 'completed') {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-50 text-center">
        <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
          <CheckCircle size={80} className="text-green-500 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.serviceCompleted}</h2>
          <p className="text-gray-500 mb-8">{t.thanksFeedback}</p>
          
          <div className="w-full bg-gray-50 p-6 rounded-2xl border border-gray-100">
            {/* กล่องตัวเลข 1-5 */}
            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map(score => (
                <button 
                  key={score} 
                  onClick={() => setRating(score)} 
                  className={`w-12 h-12 rounded-full text-xl font-bold transition-all duration-300 ${rating === score ? 'bg-yellow-400 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-600 hover:bg-yellow-200 hover:scale-105'}`}
                >
                  {score}
                </button>
              ))}
            </div></div></div></div>)}