import React from 'react';

// Hooks & Layout
import AdminLayout from '../components/admin/AdminLayout';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

// Tabs & Modals
import DashboardTab from '../components/admin/DashboardTab';
import RegistrationTab from '../components/admin/RegistrationTab';
import StudentsTab from '../components/admin/StudentsTab';
import JustificationsTab from '../components/admin/JustificationsTab';
import DailyAttendanceTab from '../components/admin/DailyAttendanceTab';
import ReportsTab from '../components/admin/ReportsTab';
import SettingsTabContent from '../components/admin/SettingsTabContent';
import TelegramTab from '../components/admin/TelegramTab';
import StudentDetailsModal from '../components/StudentDetailsModal';
import ImportStudentsModal from '../components/ImportStudentsModal';
import JustificationModal from '../components/JustificationModal';

const AdminDashboard: React.FC = () => {
    const {
        webcamRef, loading, modelsLoaded, faceDetected,
        students, schedules, justifications, logs, occupancy,
        regForm, setRegForm, capturedImage, setCapturedImage, registeredQR, setRegisteredQR,
        registeredName, lastRegisteredPhoto,
        activeTab, dailyData, setDailyData, reportFilters, setReportFilters,
        justifState, setJustifState, schForm, setSchForm, studentFilters, setStudentFilters,
        selectedStudent, setSelectedStudent, showImportModal, setShowImportModal,
        refreshAnalytics, fetchData, handleSubmitRegister
    } = useAdminDashboard();

    const grades = ["1ro Primaria", "2do Primaria", "3er Primaria", "4to Primaria", "5to Primaria", "6to Primaria", "1ro Secundaria", "2do Secundaria", "3er Secundaria", "4to Secundaria", "5to Secundaria"];
    const sections = ["A", "B", "C", "D", "E"];

    return (
        <AdminLayout activeTab={activeTab}>
            {activeTab === 'dashboard' && <DashboardTab logs={logs} occupancy={occupancy} onRefresh={refreshAnalytics} />}

            {activeTab === 'registration' && (
                <RegistrationTab
                    {...regForm}
                    setFullName={val => setRegForm(p => ({ ...p, fullName: val }))}
                    setDni={val => setRegForm(p => ({ ...p, dni: val }))}
                    setGrade={val => setRegForm(p => ({ ...p, grade: val }))}
                    setSection={val => setRegForm(p => ({ ...p, section: val }))}
                    setScheduleId={val => setRegForm(p => ({ ...p, scheduleId: val }))}
                    setTelegramChatId={val => setRegForm(p => ({ ...p, telegramChatId: val }))}
                    setNotifyTelegram={val => setRegForm(p => ({ ...p, notifyTelegram: val }))}
                    capturedImage={capturedImage} setCapturedImage={setCapturedImage}
                    registeredQR={registeredQR} setRegisteredQR={setRegisteredQR}
                    registeredName={registeredName} loading={loading} modelsLoaded={modelsLoaded}
                    grades={grades} sections={sections} schedules={schedules}
                    capture={() => setCapturedImage(webcamRef.current?.getScreenshot() || null)}
                    onSubmit={handleSubmitRegister} webcamRef={webcamRef} faceDetected={faceDetected}
                    lastRegisteredPhoto={lastRegisteredPhoto}
                />
            )}

            {activeTab === 'students' && (
                <StudentsTab
                    students={students} filterGrade={studentFilters.grade} setFilterGrade={g => setStudentFilters(p => ({ ...p, grade: g }))}
                    filterSection={studentFilters.section} setFilterSection={s => setStudentFilters(p => ({ ...p, section: s }))}
                    grades={grades} sections={sections} onImport={() => setShowImportModal(true)} onSelectStudent={setSelectedStudent}
                />
            )}

            {activeTab === 'daily_attendance' && (
                <DailyAttendanceTab
                    dailyGrade={dailyData.grade} setDailyGrade={g => setDailyData(p => ({ ...p, grade: g }))}
                    dailySection={dailyData.section} setDailySection={s => setDailyData(p => ({ ...p, section: s }))}
                    dailyDate={dailyData.date} setDailyDate={d => setDailyData(p => ({ ...p, date: d }))}
                    dailyStats={dailyData.stats} dailyLoading={dailyData.loading} grades={grades} sections={sections}
                />
            )}

            {activeTab === 'reports' && (
                <ReportsTab
                    reportDateFrom={reportFilters.from} setReportDateFrom={f => setReportFilters(p => ({ ...p, from: f }))}
                    reportDateTo={reportFilters.to} setReportDateTo={t => setReportFilters(p => ({ ...p, to: t }))}
                    reportGrade={reportFilters.grade} setReportGrade={g => setReportFilters(p => ({ ...p, grade: g }))}
                    reportSection={reportFilters.section} setReportSection={s => setReportFilters(p => ({ ...p, section: s }))}
                    grades={grades} sections={sections} onExport={() => { }}
                />
            )}

            {activeTab === 'justifications' && (
                <JustificationsTab
                    justificationStudentId={justifState.studentId} setJustificationStudentId={id => setJustifState(p => ({ ...p, studentId: id }))}
                    isLoadingAbsences={justifState.loading} justificationStudentData={justifState.studentData}
                    absences={justifState.absences} justifications={justifications} onSearchAbsences={() => { }}
                    onJustify={date => setJustifState(p => ({ ...p, selectedAbsence: date, showModal: true }))}
                />
            )}

            {activeTab === 'settings' && (
                <SettingsTabContent
                    newScheduleName={schForm.name} setNewScheduleName={n => setSchForm(p => ({ ...p, name: n }))}
                    newScheduleStart={schForm.start} setNewScheduleStart={s => setSchForm(p => ({ ...p, start: s }))}
                    newScheduleTolerance={schForm.tolerance} setNewScheduleTolerance={t => setSchForm(p => ({ ...p, tolerance: t }))}
                    schedules={schedules} onCreateSchedule={() => { }}
                />
            )}

            {selectedStudent && <StudentDetailsModal student={selectedStudent} onClose={() => setSelectedStudent(null)} onUpdate={fetchData} />}
            {showImportModal && <ImportStudentsModal onClose={() => setShowImportModal(false)} onImportSuccess={fetchData} />}
            {justifState.showModal && justifState.studentData && justifState.selectedAbsence && (
                <JustificationModal student={justifState.studentData} absenceDate={justifState.selectedAbsence} onClose={() => setJustifState(p => ({ ...p, showModal: false }))} onSuccess={() => fetchData()} />
            )}
            {activeTab === 'telegram' && <TelegramTab />}
        </AdminLayout>
    );
};

export default AdminDashboard;
