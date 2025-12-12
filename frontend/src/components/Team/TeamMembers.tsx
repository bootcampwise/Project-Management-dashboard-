import React from 'react';

interface Member {
    id: number;
    name: string;
    email: string;
    position: string;
    groups: string[];
    location: string;
    avatar: string;
}

const TeamMembers: React.FC = () => {
    const members: Member[] = [
        {
            id: 1,
            name: "Hanna Rodgers",
            email: "hanna.r@defcon.com",
            position: "QA Lead",
            groups: ["QA", "Admin"],
            location: "Warsaw, Poland",
            avatar: "https://i.pravatar.cc/150?u=hanna"
        },
        {
            id: 2,
            name: "Henry Rollins",
            email: "henry.rol@defcon.com",
            position: "Support",
            groups: ["Support"],
            location: "Berlin, Germany",
            avatar: "https://i.pravatar.cc/150?u=henry1"
        },
        {
            id: 3,
            name: "William Atkins",
            email: "william.atk@defcon.com",
            position: "Product Marketing",
            groups: ["Marketing", "Dev"],
            location: "Warsaw, Poland",
            avatar: "https://i.pravatar.cc/150?u=william"
        },
        {
            id: 4,
            name: "Mandy Harley",
            email: "mandy@defcon.com",
            position: "QA",
            groups: ["QA"],
            location: "Lisbon, Portugal",
            avatar: "https://i.pravatar.cc/150?u=mandy1"
        },
        {
            id: 5,
            name: "Henry Rollins",
            email: "henry@defcon.com",
            position: "API Lead",
            groups: ["Dev", "Admin"],
            location: "Warsaw, Poland",
            avatar: "https://i.pravatar.cc/150?u=henry2"
        },
        {
            id: 6,
            name: "Mandy Harley",
            email: "mandy@defcon.com",
            position: "Frontend",
            groups: ["Dev"],
            location: "Lisbon, Portugal",
            avatar: "https://i.pravatar.cc/150?u=mandy2"
        }
    ];

    const getGroupStyle = (group: string) => {
        switch (group) {
            case 'QA':
                return 'bg-pink-100 text-pink-700';
            case 'Admin':
                return 'bg-green-100 text-green-700';
            case 'Support':
                return 'bg-teal-100 text-teal-700';
            case 'Marketing':
                return 'bg-orange-100 text-orange-700';
            case 'Dev':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex-1 bg-white">
            <div className="min-w-[800px]"> {/* Ensure min-width for table scroll */}
                {/* Header */}
                <div className="grid grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div>Name</div>
                    <div>Position</div>
                    <div>Team groups</div>
                    <div>Location</div>
                </div>

                {/* Rows */}
                <div className="flex flex-col gap-[2px] bg-gray-50  ">
                    {members.map((member) => (
                        <div key={member.id} className="grid grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr] gap-4 px-6 h-[40px] items-center bg-white hover:bg-gray-50 transition-colors">
                            {/* Name Column */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-semibold text-gray-800">{member.name}</span>
                                        <span className="text-xs text-gray-400">{member.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Position */}
                            <div className="text-sm text-gray-600">
                                {member.position}
                            </div>

                            {/* Team Groups */}
                            <div className="flex items-center gap-2">
                                {member.groups.map((group, idx) => (
                                    <span
                                        key={idx}
                                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${getGroupStyle(group)}`}
                                    >
                                        {group}
                                    </span>
                                ))}
                            </div>

                            {/* Location */}
                            <div className="text-sm text-gray-600">
                                {member.location}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamMembers;
