"use client";

import { useState, useRef, useEffect } from "react";
import { generateLangGraphResponse } from "@/actions/langgraph";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, User, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export function AgentChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hi! I'm your **AI Channel Manager**. I can analyze your metrics and suggest content strategies. How can I help?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await generateLangGraphResponse([...messages, userMessage]);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error generating response:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-[600px] flex flex-col shadow-lg border-muted/40">
            <CardHeader className="border-b bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-5 h-5" />
                    AI Channel Strategy
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 overflow-hidden bg-dot-pattern">
                <div className="flex-1 overflow-y-auto pr-4 space-y-6">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={cn(
                                "flex gap-3 text-sm",
                                m.role === "user" ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm",
                                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-white dark:bg-zinc-800"
                                )}
                            >
                                {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            <div
                                className={cn(
                                    "rounded-2xl px-4 py-3 max-w-[85%] shadow-sm",
                                    m.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-white dark:bg-zinc-800 border rounded-bl-none"
                                )}
                            >
                                {m.role === "assistant" ? (
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown>{m.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    m.content
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 text-sm animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0 border">
                                <Bot size={14} />
                            </div>
                            <div className="bg-white dark:bg-zinc-800 border rounded-2xl rounded-bl-none px-4 py-3">
                                <span className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
                <form onSubmit={handleSubmit} className="mt-4 flex gap-2 pt-2 border-t">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask AI for analysis..."
                        disabled={isLoading}
                        className="rounded-full shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
                    />
                    <Button type="submit" disabled={isLoading} size="icon" className="rounded-full w-10 h-10 shrink-0">
                        <Send size={16} />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
