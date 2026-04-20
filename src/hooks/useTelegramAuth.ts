import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { getTelegramConfig, updateTelegramConfig, sendTelegramCode, loginTelegram } from '../services/api';

export type AuthStep = 'config' | 'phone' | 'code';

export const useTelegramAuth = () => {
    const [apiId, setApiId] = useState('');
    const [apiHash, setApiHash] = useState('');
    const [phone, setPhone] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [step, setStep] = useState<AuthStep>('config');
    const [verificationCode, setVerificationCode] = useState('');
    const [phoneCodeHash, setPhoneCodeHash] = useState('');
    const [password2FA, setPassword2FA] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const configData = await getTelegramConfig();
                setApiId(configData.api_id || '');
                setApiHash(configData.api_hash || '');
                setPhone(configData.phone || '');
                setIsActive(configData.is_active);

                if (configData.api_id && configData.api_hash) {
                    setStep(configData.phone && configData.is_active ? 'config' : 'phone');
                }
            } catch (error) {
                console.error("Error loading Telegram config", error);
            } finally {
                setLoading(false);
            }
        };
        loadConfig();
    }, []);

    const handleSaveAPIConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiId || !apiHash) {
            toast.error("API ID y Hash son requeridos");
            return;
        }
        setSaving(true);
        try {
            await updateTelegramConfig({ api_id: apiId, api_hash: apiHash });
            toast.success("Credenciales guardadas");
            setStep('phone');
        } catch {
            toast.error("Error al guardar credenciales");
        } finally {
            setSaving(false);
        }
    };

    const handleSendCode = async () => {
        if (!phone) {
            toast.error("Ingrese su número de teléfono");
            return;
        }
        
        // Validar formato de teléfono (debe ser válido)
        const phonePattern = /^\+?\d{7,15}$/;
        if (!phonePattern.test(phone)) {
            toast.error("Formato de teléfono inválido. Use formato internacional (ej: +51970980423)");
            return;
        }
        
        setSaving(true);
        try {
            await updateTelegramConfig({ phone });
            const res = await sendTelegramCode(phone);
            setPhoneCodeHash(res.phone_code_hash);
            setStep('code');
            toast.success("Código enviado a su Telegram");
        } catch (err: unknown) {
            const error = err as AxiosError<{ detail: string }>;
            const errorMsg = (error as any).response?.data?.detail || "Error al enviar código";
            
            // Mensajes más específicos según el error
            if (errorMsg.includes("enmascaradas") || errorMsg.includes("corruptas")) {
                toast.error("Las credenciales están corruptas. Por favor reingrese API ID y API Hash.");
            } else if (errorMsg.includes("incompleta")) {
                toast.error("Faltan credenciales. Configure primero el API ID y API Hash.");
            } else {
                toast.error(errorMsg);
            }
            throw err; // Re-lanzar para que el caller lo maneje si es necesario
        } finally {
            setSaving(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode) {
            toast.error("Ingrese el código recibido");
            return;
        }
        setSaving(true);
        try {
            const res = await loginTelegram({
                phone,
                code: verificationCode,
                phone_code_hash: phoneCodeHash,
                password: password2FA || undefined
            });
            if (res.status === 'success') {
                toast.success("¡Cuenta vinculada con éxito!");
                setIsActive(true);
                setStep('config');
            } else {
                toast.error(res.message);
            }
        } catch (err: unknown) {
            const error = err as AxiosError<{ detail: string }>;
            toast.error((error as any).response?.data?.detail || "Error en la verificación");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        if (!confirm("¿Está seguro de cerrar sesión? Las notificaciones se detendrán.")) return;
        setSaving(true);
        try {
            await updateTelegramConfig({ phone: '', is_active: false });
            setPhone('');
            setIsActive(false);
            setStep('config');
            toast.success("Sesión cerrada");
        } catch {
            toast.error("Error al cerrar sesión");
        } finally {
            setSaving(false);
        }
    };

    return {
        apiId, setApiId,
        apiHash, setApiHash,
        phone, setPhone,
        isActive, setIsActive,
        step, setStep,
        verificationCode, setVerificationCode,
        password2FA, setPassword2FA,
        saving, loading,
        handleSaveAPIConfig,
        handleSendCode,
        handleVerifyCode,
        handleLogout
    };
};
