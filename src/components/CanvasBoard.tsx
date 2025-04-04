'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useDrawingStore } from '@/store/drawingStore'
import { saveToLocal, loadFromLocal } from '@/lib/storage'

export default function CanvasBoard() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const isDrawing = useRef(false)
    const { lines, addLine, reset, undo, redo } = useDrawingStore()
    const [currentLine, setCurrentLine] = useState<{ x: number; y: number }[]>([])

    const startDrawing = (e: React.MouseEvent) => {
        isDrawing.current = true
        const pos = getCoords(e)
        setCurrentLine([pos])
    }

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing.current) return
        const pos = getCoords(e)
        setCurrentLine((line) => [...line, pos])
    }

    const endDrawing = () => {
        if (!isDrawing.current) return
        isDrawing.current = false
        if (currentLine.length > 1) {
            addLine({ points: currentLine })
        }
        setCurrentLine([])
    }

    const getCoords = (e: React.MouseEvent) => {
        const canvas = canvasRef.current!
        const rect = canvas.getBoundingClientRect()
        return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const drawSmoothLine = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
        if (points.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i++) {
            const midPoint = {
                x: (points[i].x + points[i + 1].x) / 2,
                y: (points[i].y + points[i + 1].y) / 2,
            };
            ctx.quadraticCurveTo(points[i].x, points[i].y, midPoint.x, midPoint.y);
        }

        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.stroke();
    };

    const redraw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scale = window.devicePixelRatio || 1;

        if (
            canvas.width !== 800 * scale ||
            canvas.height !== 600 * scale
        ) {
            canvas.width = 800 * scale;
            canvas.height = 600 * scale;
            canvas.style.width = '800px';
            canvas.style.height = '600px';
            ctx.scale(scale, scale);
        }

        ctx.clearRect(0, 0, 800, 600);

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;

        if (currentLine.length > 1) {
            drawSmoothLine(ctx, currentLine);
        }

        for (const line of lines) {
            drawSmoothLine(ctx, line.points);
        }
    }, [canvasRef, currentLine, lines]);


    useEffect(() => {
        redraw()
    }, [redraw, lines, currentLine])





    const save = useCallback(() => {
        saveToLocal(lines)
        alert('Saved to localStorage!')
    }, [lines])

    const load = useCallback(() => {
        const saved = loadFromLocal()
        if (saved) {
            reset()
            for (const line of saved) addLine(line)
        }
    }, [reset, addLine])

    const exportPNG = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const link = document.createElement('a')
        link.download = 'drawing.png'
        link.href = canvas.toDataURL()
        link.click()
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'z':
                        e.preventDefault()
                        undo()
                        break
                    case 'y':
                        e.preventDefault()
                        redo()
                        break
                    case 'x':
                        e.preventDefault()
                        save()
                        break
                    case 'c':
                        e.preventDefault()
                        load()
                        break
                    case 'v':
                        e.preventDefault()
                        exportPNG()
                        break
                    default:
                        break
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [undo, redo, save, load, exportPNG])


    return (
        <div className="flex flex-col items-center">
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border border-gray-400 rounded-lg"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
            />
            <div className="space-x-2 mt-4">
                <button onClick={undo}>Undo</button>
                <button onClick={redo}>Redo</button>
                <button onClick={save}>Save</button>
                <button onClick={load}>Load</button>
                <button onClick={exportPNG}>Export</button>
            </div>
            <div className="space-x-2 mt-4">
                Ctrl Z • Ctrl Y • Ctrl X • Ctrl C • Ctrl V
            </div>
        </div>
    )
}
