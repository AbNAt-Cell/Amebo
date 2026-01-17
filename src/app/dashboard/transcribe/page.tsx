'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Square, Upload, Loader2, FileAudio } from 'lucide-react';

export default function TranscribePage() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcribing, setTranscribing] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                await handleUpload(blob);
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (error) {
            console.error('Failed to access microphone:', error);
            alert('Could not access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach((track) => track.stop());
            setIsRecording(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleUpload(file);
        }
    };

    const handleUpload = async (blob: Blob) => {
        setTranscribing(true);
        const formData = new FormData();
        formData.append('file', blob);

        try {
            const response = await fetch('/api/ai/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Transcription failed');

            const data = await response.json();

            // Redirect to the new note
            if (data.noteId) {
                router.push(`/dashboard/notes/${data.noteId}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Transcription failed. Please try again.');
        } finally {
            setTranscribing(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Audio Transcription
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                Record your voice or upload an audio file to convert it into text.
            </p>

            {/* Recording Section */}
            <div className="bg-white dark:bg-[#181b21] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center mb-6">
                <div className="mb-6">
                    <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all ${isRecording
                            ? 'bg-red-50 dark:bg-red-900/20 animate-pulse'
                            : 'bg-[#EEE2F4] dark:bg-[#8D1CDF]/20'
                        }`}>
                        <Mic className={`w-10 h-10 ${isRecording ? 'text-red-500' : 'text-[#8D1CDF]'
                            }`} />
                    </div>
                </div>

                {isRecording ? (
                    <div>
                        <p className="text-lg font-medium text-red-500 mb-4 animate-pulse">
                            Recording in progress...
                        </p>
                        <button
                            onClick={stopRecording}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-500/20"
                        >
                            <Square className="w-5 h-5 fill-current" />
                            Stop & Transcribe
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={startRecording}
                        disabled={transcribing}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#8D1CDF] hover:bg-[#7316b5] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#8D1CDF]/20 disabled:opacity-50"
                    >
                        <Mic className="w-5 h-5" />
                        Start Recording
                    </button>
                )}
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                <span className="text-sm text-gray-500 font-medium">OR</span>
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
            </div>

            {/* Upload Section */}
            <div className="text-center">
                <input
                    type="file"
                    accept="audio/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={transcribing || isRecording}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium text-gray-700 dark:text-gray-300 transition-all disabled:opacity-50"
                >
                    {transcribing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Upload className="w-5 h-5" />
                    )}
                    Upload Audio File
                </button>
                <p className="text-xs text-gray-500 mt-2">
                    Supports MP3, WAV, M4A, WEBM (Max 10MB)
                </p>
            </div>

            {/* Loading State Overlay */}
            {transcribing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-[#181b21] p-8 rounded-2xl shadow-2xl flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-[#8D1CDF] animate-spin mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Transcribing with AI...
                        </h3>
                        <p className="text-gray-500 text-center max-w-xs">
                            This may take a few moments depending on the audio length.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
