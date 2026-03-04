import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Card from '../../ui/Card';
import { useTelegramAuth } from '../../../hooks/useTelegramAuth';

const TelegramAuthFlow: React.FC = () => {
    const {
        apiId, setApiId,
        apiHash, setApiHash,
        phone, setPhone,
        isActive,
        step, setStep,
        verificationCode, setVerificationCode,
        password2FA, setPassword2FA,
        saving,
        handleSaveAPIConfig,
        handleSendCode,
        handleVerifyCode,
        handleLogout
    } = useTelegramAuth();

    return (
        <Card title="Cuenta Personal MTProto" description="Use su cuenta personal para enviar avisos directos" icon="account_circle">
            <AnimatePresence mode="wait">
                {step === 'config' && (
                    <motion.div key="config" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                        <form onSubmit={handleSaveAPIConfig} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="App API ID"
                                value={apiId}
                                onChange={(e) => setApiId(e.target.value)}
                                placeholder="Ingrese API ID"
                                className="font-mono"
                            />
                            <Input
                                label="App API Hash"
                                type="password"
                                value={apiHash}
                                onChange={(e) => setApiHash(e.target.value)}
                                placeholder="Ingrese API Hash"
                                className="font-mono"
                            />
                            <div className="md:col-span-2 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <span className="material-icons-outlined">{isActive ? 'verified_user' : 'no_accounts'}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{isActive ? `Sesión Activa: ${phone}` : 'Sesión No Iniciada'}</h4>
                                        <p className="text-xs text-slate-500">{isActive ? 'El sistema está enviando notificaciones' : 'Configure sus credenciales para comenzar'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    {isActive ? (
                                        <Button variant="red" onClick={handleLogout}>Cerrar Sesión</Button>
                                    ) : (
                                        <Button type="submit" isLoading={saving}>Siguiente Paso</Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}

                {step === 'phone' && (
                    <motion.div key="phone" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-md mx-auto text-center space-y-6 py-4">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-icons-outlined text-3xl">phone</span>
                        </div>
                        <h3 className="text-xl font-bold">Ingrese su Número de Teléfono</h3>
                        <p className="text-slate-500 text-sm">Recibirá un código de verificación directamente en su aplicación de Telegram</p>
                        <Input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+51 987 654 321"
                            className="text-xl font-bold text-center"
                        />
                        <div className="flex gap-4">
                            <Button variant="secondary" onClick={() => setStep('config')} className="flex-1">Volver</Button>
                            <Button onClick={handleSendCode} isLoading={saving} className="flex-2">Enviar Código</Button>
                        </div>
                    </motion.div>
                )}

                {step === 'code' && (
                    <motion.div key="code" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-md mx-auto text-center space-y-6 py-4">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-icons-outlined text-3xl">lock_open</span>
                        </div>
                        <h3 className="text-xl font-bold">Verificación de Cuenta</h3>
                        <p className="text-slate-500 text-sm">Ingrese el código de 5 dígitos y su contraseña 2FA si la tiene activa</p>
                        <div className="space-y-4">
                            <Input
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="Código de 5 dígitos"
                                maxLength={10}
                                className="text-xl font-bold text-center tracking-widest"
                            />
                            <Input
                                type="password"
                                value={password2FA}
                                onChange={(e) => setPassword2FA(e.target.value)}
                                placeholder="Contraseña 2FA (Opcional)"
                                className="text-sm font-semibold text-center"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button variant="secondary" onClick={() => setStep('phone')} className="flex-1">Cambiar Número</Button>
                            <Button variant="green" onClick={handleVerifyCode} isLoading={saving} className="flex-2">Finalizar Conexión</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
};

export default TelegramAuthFlow;
