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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            handleCancel();
            await fetchUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Error al guardar el usuario. Verifica los datos.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
        setLoading(true);
        try {
            await deleteUser(id);
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
        refreshUsers: fetchUsers
    };
};
