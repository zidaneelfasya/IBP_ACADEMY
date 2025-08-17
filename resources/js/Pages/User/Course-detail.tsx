"use client";

import { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    ArrowLeft,
    CheckCircle,
    Download,
    File,
    ImageIcon,
    FileText,
    Video,
    Eye,
    Play,
    Home,
} from "lucide-react";
import Link from "next/link";

interface Attachment {
    id: string;
    name: string;
    type: "pdf" | "video" | "image" | "document";
    size: string;
    url: string;
}

interface MaterialDetail {
    id: string;
    title: string;
    description: string;
    content: string;
    videoUrl?: string;
    instructor: string;
    category: string;
    rating: number;
    totalStudents: number;
    totalDuration: string;
    isCompleted: boolean;
    attachments: Attachment[];
    thumbnail: string;
}

const mockMaterial: MaterialDetail = {
    id: "1",
    title: "Introduction to React Fundamentals",
    description:
        "Learn React basics from scratch to advanced level. This material covers components, props, state, lifecycle methods, and best practices in modern React application development.",
    videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
    content: `
# Introduction to React Fundamentals

React is a powerful JavaScript library for building user interfaces, particularly web applications. Developed by Facebook, React has revolutionized the way we think about building interactive UIs.

## What is React?

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components."

### Key Concepts

**Components**: React applications are built using components. A component is a JavaScript function or class that optionally accepts inputs (called "props") and returns a React element that describes what should appear on the screen.

**JSX**: JSX is a syntax extension for JavaScript that looks similar to HTML. It allows you to write HTML-like code in your JavaScript files, making it easier to create and visualize the structure of your UI.

**Virtual DOM**: React uses a virtual representation of the DOM in memory. When the state of your application changes, React creates a new virtual DOM tree and compares it with the previous one, updating only the parts that have changed.

## Getting Started

To start working with React, you'll need to set up your development environment:

1. **Install Node.js**: React requires Node.js to run the development tools.
2. **Create React App**: Use Create React App to set up a new React project quickly.
3. **Understanding the Project Structure**: Learn about the files and folders in a React project.

## Components and Props

Components are the building blocks of React applications. They can be defined as functions or classes:

### Function Components
\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
\`\`\`

### Class Components
\`\`\`jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
\`\`\`

## State Management

State allows React components to change their output over time in response to user actions, network responses, and anything else.

### useState Hook
\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Event Handling

React events are named using camelCase, and you pass a function as the event handler:

\`\`\`jsx
function Button() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
\`\`\`

## Best Practices

1. **Keep Components Small**: Break down complex components into smaller, reusable pieces.
2. **Use Functional Components**: Prefer function components with hooks over class components.
3. **Props Validation**: Use PropTypes or TypeScript for type checking.
4. **State Management**: Keep state as local as possible and lift it up when needed.
5. **Performance**: Use React.memo, useMemo, and useCallback for optimization when necessary.

## Conclusion

React provides a powerful and flexible way to build user interfaces. By understanding components, props, state, and event handling, you'll be well on your way to building amazing React applications.

Remember to practice regularly and build projects to solidify your understanding of these concepts.
  `,
    instructor: "John Doe",
    category: "Frontend Development",
    rating: 4.8,
    totalStudents: 1250,
    totalDuration: "4 hours 30 minutes",
    isCompleted: false,
    thumbnail: "/react-course-thumbnail.png",
    attachments: [
        {
            id: "1",
            name: "React Fundamentals Guide.pdf",
            type: "pdf",
            size: "2.5 MB",
            url: "/attachments/react-guide.pdf",
        },
        {
            id: "2",
            name: "Component Examples.zip",
            type: "document",
            size: "1.8 MB",
            url: "/attachments/component-examples.zip",
        },
        {
            id: "3",
            name: "React Cheat Sheet.pdf",
            type: "pdf",
            size: "850 KB",
            url: "/attachments/react-cheatsheet.pdf",
        },
        {
            id: "4",
            name: "Setup Instructions.docx",
            type: "document",
            size: "450 KB",
            url: "/attachments/setup-instructions.docx",
        },
    ],
};

export default function MaterialDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const [material, setMaterial] = useState<MaterialDetail>(mockMaterial);

    const toggleMaterialComplete = () => {
        setMaterial((prev) => ({
            ...prev,
            isCompleted: !prev.isCompleted,
        }));
    };

    const getAttachmentIcon = (type: string) => {
        switch (type) {
            case "pdf":
                return <FileText className="w-4 h-4 text-red-500" />;
            case "video":
                return <Video className="w-4 h-4 text-blue-500" />;
            case "image":
                return <ImageIcon className="w-4 h-4 text-green-500" />;
            default:
                return <File className="w-4 h-4 text-gray-500" />;
        }
    };

    const getEmbedUrl = (url: string) => {
        if (url.includes("youtube.com/watch?v=")) {
            const videoId = url.split("v=")[1].split("&")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes("youtu.be/")) {
            const videoId = url.split("youtu.be/")[1].split("?")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes("vimeo.com/")) {
            const videoId = url.split("vimeo.com/")[1];
            return `https://player.vimeo.com/video/${videoId}`;
        }
        return url;
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header with navigation buttons */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/user">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Materials
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <Home className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Material Info */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <img
                                        src={
                                            material.thumbnail ||
                                            "/placeholder.svg"
                                        }
                                        alt={material.title}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <h1 className="text-2xl font-bold text-foreground">
                                                {material.title}
                                            </h1>
                                            {material.isCompleted && (
                                                <Badge className="bg-green-500 text-white">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Completed
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground mb-4">
                                            {material.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                {material.totalStudents}{" "}
                                                students
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {material.totalDuration}
                                            </span>
                                            <span>•</span>
                                            <span>{material.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {material.videoUrl && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Play className="w-5 h-5 text-blue-500" />
                                        Video Content
                                    </CardTitle>
                                    <CardDescription>
                                        Watch the instructional video for this
                                        material
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                                        <iframe
                                            src={getEmbedUrl(material.videoUrl)}
                                            title={material.title}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Progress Tracking</CardTitle>
                                <CardDescription>
                                    Mark your progress as you go through the
                                    material
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {material.isCompleted
                                            ? "You've completed this material"
                                            : "Mark when finished"}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant={
                                            material.isCompleted
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={toggleMaterialComplete}
                                    >
                                        {material.isCompleted ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Completed
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Mark as Complete
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Full Material Content</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-gray dark:prose-invert max-w-none">
                                    <div
                                        className="whitespace-pre-wrap text-sm leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: material.content,
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Attachments and Info */}
                    <div className="space-y-6">
                        {/* Attachments */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Downloadable Resources</CardTitle>
                                <CardDescription>
                                    Supporting files for this material
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {material.attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            {getAttachmentIcon(attachment.type)}
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {attachment.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {attachment.size}
                                                </p>
                                            </div>
                                        </div>
                                        <a href={attachment.url} download>
                                            <Button size="sm" variant="ghost">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </a>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Instructor Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About the Instructor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                        <span className="font-semibold text-accent">
                                            JD
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {material.instructor}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Senior Frontend Developer
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-yellow-500">
                                                ★
                                            </span>
                                            <span className="text-sm">
                                                {material.rating}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                ({material.totalStudents}{" "}
                                                students)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
