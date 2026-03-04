/**
 * Servicio de Audio para el sistema de asistencia
 * Utiliza Web Audio API para generar sonidos sin depender de archivos externos MP3.
 */

class AudioService {
    private context: AudioContext | null = null;

    private getContext() {
        if (!this.context) {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            this.context = new AudioContextClass();
        }
        return this.context;
    }

    private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
        try {
            const ctx = this.getContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.warn("Audio play blocked by browser policy or error:", e);
        }
    }

    // Un "ding" limpio y agudo para éxito
    playSuccess() {
        this.playTone(880, 'sine', 0.5, 0.2); // Nota La5
    }

    // Tono doble tipo notificación para advertencias (duplicados/tardanzas)
    playNotification() {
        this.playTone(440, 'triangle', 0.15, 0.1);
        setTimeout(() => this.playTone(660, 'triangle', 0.2, 0.1), 150);
    }

    // Tono grave y corto para error
    playError() {
        this.playTone(150, 'sawtooth', 0.3, 0.1);
    }
}

export const audioService = new AudioService();
