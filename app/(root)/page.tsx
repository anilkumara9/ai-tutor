import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  try {
    const user = await getCurrentUser();

    const [userInterviews, allInterview] = await Promise.all([
      getInterviewsByUserId(user?.id),
      getLatestInterviews({ userId: user?.id }),
    ]);

    // Ensure we have arrays even if the functions return null
    const userInterviewsArray = userInterviews || [];
    const allInterviewArray = allInterview || [];

    const hasPastInterviews = userInterviewsArray.length > 0;
    const hasUpcomingInterviews = allInterviewArray.length > 0;

    return (
      <>
        <section className="card-cta">
          <div className="flex flex-col gap-6 max-w-lg">
            <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
            <p className="text-lg">
              Practice real interview questions & get instant feedback
            </p>

            <Button asChild className="btn-primary max-sm:w-full">
              <Link href="/interview">Start an Interview</Link>
            </Button>
          </div>

          <Image
            src="/robot.png"
            alt="robo-dude"
            width={400}
            height={400}
            className="max-sm:hidden"
          />
        </section>

        <section className="card-cta mt-12 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-8">
          <div className="flex flex-col gap-6 max-w-lg">
            <h2 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              OmniLearn Nexus: The Future of Learning
            </h2>
            <p className="text-lg">
              Experience a decentralized, self-sovereign learning metaverse with
              AI tutors and blockchain credentials
            </p>

            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white max-sm:w-full hover:from-blue-700 hover:via-purple-700 hover:to-pink-700"
            >
              <Link href="/nexus">Explore OmniLearn Nexus</Link>
            </Button>
          </div>

          <Image
            src="/icons/nexus-logo.svg"
            alt="OmniLearn Nexus Logo"
            width={300}
            height={300}
            className="max-sm:hidden"
          />
        </section>

        <section className="flex flex-col gap-6 mt-8">
          <h2>Your Interviews</h2>

          <div className="interviews-section">
            {hasPastInterviews ? (
              userInterviewsArray.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <p>You haven&apos;t taken any interviews yet</p>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-6 mt-8">
          <h2>Take Interviews</h2>

          <div className="interviews-section">
            {hasUpcomingInterviews ? (
              allInterviewArray.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <p>There are no interviews available</p>
            )}
          </div>
        </section>
      </>
    );
  } catch (error) {
    console.error("Error in Home component:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2>Something went wrong</h2>
        <p>
          We're having trouble loading your interviews. Please try again later.
        </p>
        <Button asChild className="btn-primary mt-4">
          <Link href="/interview">Start a New Interview</Link>
        </Button>
      </div>
    );
  }
}

export default Home;
