import { Font, Head, Heading, Html, Preview, Row, Section, Text } from "@react-email/components";

type VerificationEmailProps = {
  username: string;
  otp: string;
};

const verificationEmail = ({ username, otp }: VerificationEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head>
      <title>Verification Code</title>
      <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview> Here is your verification code: {otp}
      </Preview>
        <Section>
          <Row>
            <Heading as="h2">Hello {username}</Heading>
          </Row>
          <Text>
            Thank you for registering to NoCap Message. Please use the following verification code to complete the registration.
          </Text>
          <Row>
            <Text>{otp}</Text>
          </Row>
          <Row>
            <Text>If you did not request this code, please ignore this email.</Text>
          </Row>
          
        </Section>

      {/* Your email content here */}
    </Html>
  );
};

export default verificationEmail;