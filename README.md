# Software Development Quiz Game

* This is an app developed using NextJS on [Vercel](https://vercel.com).
* It's using Amazon DynamoDB as the data store. Check out the [CloudFormation template](./aws_cloudformation_template.yaml) for details.
* The UI components were built using [v0.dev](https://v0.dev).

## Data Models

### User
{
  pk: USER#{userId},
  sk: USER#{userId},
  email: string,
  score: number,
  gamesPlayed: number,
  gsi1pk: LEADER_BOARD,
  gsi1sk: SCORE#{score}#{userId},
}

### Quiz
{
  pk: QUIZ#{date},
  sk: QUIZ,
  questions: [
    {
      question: string,
      options: string[],
      answer: number,
    }
  ],
}

### Quiz Submission
{
  pk: USER#{userId},
  sk: QUIZ#{date},
  answers: number[],
  score: number,
  gsi1pk: SUBMISSION#{date},
  gsi1sk: USER#{userId},
}

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
