import { H1, P, H2, H3 } from "@/components/typography";
import Link from "next/link";
import React from "react";

const PrivacyPage = () => {
  const lastUpdated = new Date("2024-10-16").toLocaleDateString();
  const email = "magnus.rodseth@gmail.com";

  return (
    <div className="container mx-auto flex flex-col gap-2 p-4">
      <H1>Privacy Policy</H1>
      <P>Last updated: {lastUpdated}</P>

      <P>
        Your privacy is important to us. This Privacy Policy explains how we
        collect, use, and protect your personal information when you use our
        application.
      </P>

      <H2>Information We Collect</H2>
      <H3>Google Account Information</H3>
      <P>
        When you sign in with Google, we collect your basic profile information,
        such as your name and email address, to authenticate your access to the
        application.
      </P>

      <H3>Google Calendar Data</H3>
      <P>
        With your explicit permission, we access your Google Calendar events to
        calculate and display your availability. We only access the necessary
        event data for this purpose.
      </P>

      <H2>How We Use Your Information</H2>
      <P>We use the collected information to:</P>
      <ul className="list-disc pl-6">
        <li>
          <P>Authenticate and authorize your access to the application.</P>
        </li>
        <li>
          <P>
            Retrieve and process your calendar events to compute your
            availability.
          </P>
        </li>
      </ul>

      <H2>Data Storage and Security</H2>
      <P>
        We do not store your Google Calendar data on our servers. All data
        processing is performed temporarily and securely during your session. We
        implement industry-standard security measures to protect your personal
        information from unauthorized access.
      </P>

      <H2>Third-Party Services</H2>
      <P>
        Our application uses the Google Calendar API to access your calendar
        data. By using our application, you also agree to be bound by Google's
        Privacy Policy.
      </P>

      <H2>Your Choices</H2>
      <P>
        You can revoke the application's access to your Google Account at any
        time through your Google Account settings. This will prevent the
        application from accessing your calendar data in the future.
      </P>

      <H2>Changes to This Privacy Policy</H2>
      <P>
        We may update our Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page.
      </P>

      <H2>Contact Us</H2>
      <P>
        If you have any questions about this Privacy Policy, please contact us
        at{" "}
        <Link
          href={`mailto:${email}`}
          className="underline hover:text-accent-foreground transition-all transform duration-300 ease-in-out"
        >
          {email}
        </Link>
        .
      </P>
    </div>
  );
};

export default PrivacyPage;
