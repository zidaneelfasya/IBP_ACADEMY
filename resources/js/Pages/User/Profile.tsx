"use client";

import UserLayout  from "@/Layouts/UserLayout";
import ParticipantProfile from "@/Components/participant-profile";

export default function ProfilePage() {
    return (
        <UserLayout title="My Profile">
            <ParticipantProfile />
        </UserLayout>
    );
}
