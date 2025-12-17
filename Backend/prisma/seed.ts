import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a sample user
  const user = await prisma.user.create({
    data: {
      supabaseId: "seed-supabase-id-1",
      email: "seed.user@example.com",
      name: "Seed User",
      avatar: "https://avatar.vercel.sh/seed-user",
      role: "MEMBER",
      specificRole: "DEVELOPER",
      jobTitle: "Frontend Developer",
      department: "Engineering",
      profileBio: "This is a seeded user for local development",
      isActive: true,
    },
  });

  console.log("Created user:", user.id);

  // Create a sample project owned by the user
  const project = await prisma.project.create({
    data: {
      name: "Seed Project",
      key: "SEED",
      description: "A sample seeded project",
      ownerId: user.id,
      memberIds: [user.id],
      progress: 0,
      status: "ACTIVE",
    },
  });

  console.log("Created project:", project.id);

  // Create a couple of sample tasks for the project
  const task1 = await prisma.task.create({
    data: {
      title: "Seed Task 1",
      description: "First seeded task",
      status: "BACKLOG",
      priority: "MEDIUM",
      projectId: project.id,
      creatorId: user.id,
      assigneeId: user.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Seed Task 2",
      description: "Second seeded task",
      status: "TODO",
      priority: "HIGH",
      projectId: project.id,
      creatorId: user.id,
    },
  });

  console.log("Created tasks:", task1.id, task2.id);

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
