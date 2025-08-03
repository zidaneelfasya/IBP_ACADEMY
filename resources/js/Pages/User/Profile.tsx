"use client";

import UserLayout  from "@/Layouts/UserLayout";
import ParticipantProfile from "@/Components/user-profile";

export default function ProfilePage() {
    return (
        <UserLayout title="My Profile">
            <ParticipantProfile />
        </UserLayout>
    );
}
