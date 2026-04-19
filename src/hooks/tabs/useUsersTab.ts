import { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser, type AdminUser } from '../../services/api';

export const useUsersTab = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [form, setForm] = useState({
        username: '',
        full_name: '',
        email: '',
        password: '',
        role: 'DOCENTE',
        is_active: true,
        is_superuser: false
    });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleEdit = (user: AdminUser) => {
        setEditingUser(user);
        setForm({
            username: user.username,
            full_name: user.full_name || '',
            email: user.email || '',
            password: '', // Password empty by default on edit
            role: (user as any).role || 'DOCENTE',
            is_active: user.is_active,
            is_superuser: user.is_superuser
        });
    };

    const handleCancel = () => {
        setEditingUser(null);
        setForm({
            username: '',
            full_name: '',
            email: '',
            password: '',
            role: 'DOCENTE',
            is_active: true,
            is_superuser: false
        });
    };

    const validatePassword = (pass: string) => {
        if (!pass) return true; // Si está vacío (en edición), es válido
        const hasUpper = /[A-Z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const isLongEnough = pass.length >= 8;
        return hasUpper && hasNumber && isLongEnough;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar contraseña
        if (form.password && !validatePassword(form.password)) {
            const { toast } = await import('sonner');
            return toast.error("Contraseña Débil", {
                description: "Debe tener al menos 8 caracteres, una mayúscula y un número."
            });
        }

        setLoading(true);
        try {
            const payload = { ...form };
            // Pydantic's EmailStr triggers 422 error on empty strings, so delete it if empty
            if (!payload.email) delete (payload as any).email;

            if (editingUser) {
                // Remove password if empty to not update it
                if (!payload.password) delete (payload as any).password;
                await updateUser(editingUser.id, payload);
            } else {
                await createUser(payload);
            }
            const { toast } = await import('sonner');
            toast.success(editingUser ? "Usuario Actualizado" : "Usuario Creado");
            handleCancel();
            await fetchUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            const { toast } = await import('sonner');
            toast.error("Error al guardar", {
                description: "Verifique los datos e intente nuevamente."
            });
        } finally {
            setLoading(false);
        }
    };

    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    const handleDelete = async () => {
        if (!userToDelete) return;
        setLoading(true);
        try {
            await deleteUser(userToDelete);
            setUserToDelete(null);
            const { toast } = await import('sonner');
            toast.success("Usuario eliminado correctamente");
            await fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        loading,
        form,
        setForm,
        editingUser,
        handleEdit,
        handleCancel,
        handleSubmit,
        handleDelete,
        userToDelete,
        setUserToDelete,
        refreshUsers: fetchUsers
    };
};
