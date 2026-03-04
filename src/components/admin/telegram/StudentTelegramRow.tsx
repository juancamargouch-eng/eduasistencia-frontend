import React from 'react';
import Badge from '../../ui/Badge';
import { BASE_URL, type Student } from '../../../services/api';

interface StudentTelegramRowProps {
    student: Student;
    onUpdateChatId: (student: Student, chatId: string) => void;
    onToggleNotify: (student: Student) => void;
}

const StudentTelegramRow: React.FC<StudentTelegramRowProps> = ({ student, onUpdateChatId, onToggleNotify }) => {
    return (
        <tr className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
            <td className="py-4">
                <div className="flex items-center gap-3">
                    {student.photo_url ? (
                        <img src={`${BASE_URL}${student.photo_url}`} className="w-10 h-10 rounded-full object-cover border border-slate-200" alt="" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <span className="material-icons-outlined">person</span>
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-sm leading-tight">{student.full_name}</p>
                        <p className="text-xs text-slate-400 font-mono">{student.dni}</p>
                    </div>
                </div>
            </td>
            <td className="py-4 text-sm font-medium">
                {student.grade} - "{student.section}"
            </td>
            <td className="py-4">
                <input
                    type="text"
                    defaultValue={student.telegram_chat_id || ''}
                    placeholder="@usuario o número"
                    onBlur={(e) => onUpdateChatId(student, e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-primary/30 focus:ring-0 text-sm w-40 font-mono transition-all"
                />
            </td>
            <td className="py-4">
                <div className="flex flex-col">
                    <Badge variant={student.telegram_user_id ? 'success' : 'neutral'}>
                        {student.telegram_user_id ? 'Vinculado ✅' : 'Pendiente'}
                    </Badge>
                    {student.telegram_user_id && (
                        <span className="text-[10px] text-slate-400 font-mono mt-1">ID: {student.telegram_user_id}</span>
                    )}
                </div>
            </td>
            <td className="py-4 text-right">
                <button
                    onClick={() => onToggleNotify(student)}
                    className={`p-1.5 rounded-lg transition-colors ${student.notify_telegram ? 'text-green-500 bg-green-50 dark:bg-green-500/10' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}
                >
                    <span className="material-icons-outlined text-xl">
                        {student.notify_telegram ? 'notifications_active' : 'notifications_off'}
                    </span>
                </button>
            </td>
        </tr>
    );
};

export default StudentTelegramRow;
