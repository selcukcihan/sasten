/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/pxp4wmTYZ52
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Button } from "@/components/ui/button"
import { Session } from "next-auth"
import { signIn, signOut } from "../auth"
import { LeaderBoardUser, Quiz, QuizSubmission, User } from '../core/db'
import { QuestionsView } from "./questions-view"

const getLeaderBoardRowClassName = (idx: number) => {
  const others = "text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-2 "
  switch (idx) {
    case 0:
      return others + " bg-yellow-500"
    default:
      return others + " bg-gray-500"
  }
}

export function QuizView(props: any) {
  const session = props.session as (Session | null)
  const quiz = props.quiz as Quiz
  const user = props.user as User | undefined
  const userQuiz = props.userQuiz as QuizSubmission | undefined
  const topScores = props.topScores as LeaderBoardUser[]

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-900 text-white py-2 px-6">
        <div className="container mx-auto flex flex-row justify-between items-center">
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <LogoIcon className="fill-white" />
            <h1 className="text-xl lg:text-2xl font-bold text-center">Dev Quiz</h1>
          </div>
          <div className="flex flex-col text-sm lg:text-lg gap-4">
            {user && <div className="text-gray-300">{user.email}</div>}
            <div className="place-self-center text-black dark:text-white">
              {session ? (
                <form
                  action={async () => {
                    "use server"
                    await signOut()
                  }}
                >
                  <Button size="sm" variant="outline" type="submit">
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    <span>Sign Out</span>
                  </Button>
                </form>
              ) : (
                <form
                  action={async () => {
                    "use server"
                    await signIn("google")
                  }}
                >
                  <Button size="sm" type="submit" variant="secondary" className="lg:text-base lg:font-semibold">
                    <ChromeIcon className="h-4 w-4 mr-2" />
                    Sign in with Google
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </header>
      <QuestionsView session={session} quiz={quiz} user={user} userQuiz={userQuiz} />
      <footer className="bg-gray-900 text-white py-4 px-6">
        <div className="flex flex-col items-center gap-2">
          <div>
            <h2 className="text-xl font-bold">Leaderboard</h2>
          </div>
          <div className="flex flex-col">
            {topScores.map((user, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <div className={getLeaderBoardRowClassName(idx)}>
                  {idx + 1}
                </div>
                <div>{user.name}: {user.score}</div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

function ChromeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  )
}

function LogOutIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}

function LogoIcon(props: any) {
  return (
    <svg {...props} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
      width="48px" height="48px" viewBox="0 0 29.535 29.535"
      xmlSpace="preserve">
    <g>
      <path d="M12.646,10.335l-2.419,12.694h-0.002L0,24.544l13.643,4.896l12.146-1.632l3.746-15.817L12.646,10.335z M10.247,27.53
        l-3.348-1.277l1.613-0.217l3.757,1.256L10.247,27.53z M24.68,26.48l-13.512-3.821l2.17-11.208l14.496,1.704L24.68,26.48z
        M8.535,9.507h1.61v1.532h-1.61V9.507z M8.954,7.355H7.337c0.015-0.241,0.064-0.482,0.147-0.717
        c0.082-0.233,0.208-0.443,0.378-0.63c0.171-0.185,0.389-0.336,0.655-0.45c0.266-0.117,0.59-0.176,0.971-0.176
        c0.376,0,0.694,0.05,0.952,0.152c0.258,0.1,0.467,0.23,0.627,0.386c0.16,0.158,0.278,0.331,0.352,0.519
        c0.075,0.188,0.117,0.368,0.128,0.538c0,0.237-0.032,0.43-0.093,0.576s-0.143,0.27-0.244,0.368
        C11.109,8.02,10.998,8.1,10.874,8.165c-0.124,0.064-0.251,0.129-0.379,0.197c-0.088,0.047-0.16,0.093-0.217,0.139
        c-0.057,0.047-0.102,0.095-0.132,0.146c-0.03,0.052-0.052,0.111-0.066,0.179c-0.013,0.066-0.019,0.143-0.019,0.23H8.629
        C8.624,8.98,8.621,8.884,8.621,8.764c0-0.123,0.016-0.25,0.047-0.378c0.03-0.129,0.084-0.257,0.162-0.38
        c0.078-0.122,0.191-0.226,0.341-0.31c0.061-0.032,0.134-0.065,0.217-0.101c0.083-0.034,0.161-0.074,0.236-0.12
        c0.073-0.043,0.137-0.096,0.189-0.156C9.864,7.257,9.89,7.182,9.89,7.094c0-0.265-0.148-0.396-0.448-0.396
        c-0.186,0-0.318,0.067-0.395,0.201C8.969,7.034,8.938,7.186,8.954,7.355z M17.941,18.829l1.801,1.218l-1.158,1.715l-1.803-1.218
        L17.941,18.829z M23.49,16.727c0.061,0.297,0.061,0.58,0.002,0.849c-0.061,0.267-0.148,0.5-0.266,0.697
        c-0.179,0.268-0.357,0.458-0.539,0.575c-0.183,0.118-0.363,0.193-0.554,0.228c-0.186,0.037-0.372,0.041-0.561,0.021
        c-0.188-0.021-0.38-0.044-0.574-0.064c-0.133-0.017-0.248-0.019-0.349-0.009c-0.099,0.009-0.184,0.029-0.258,0.063
        c-0.074,0.036-0.145,0.084-0.209,0.149c-0.063,0.064-0.129,0.146-0.197,0.243l-1.604-1.082c0.053-0.091,0.123-0.2,0.215-0.336
        c0.094-0.138,0.207-0.268,0.338-0.388c0.133-0.122,0.289-0.222,0.469-0.302c0.183-0.082,0.388-0.111,0.617-0.09
        c0.09,0.012,0.197,0.028,0.316,0.051s0.238,0.037,0.354,0.045c0.117,0.008,0.229-0.004,0.332-0.035
        c0.104-0.03,0.19-0.094,0.258-0.19c0.197-0.297,0.133-0.557-0.203-0.783c-0.207-0.14-0.406-0.164-0.596-0.071
        c-0.188,0.09-0.338,0.239-0.447,0.44l-1.812-1.226c0.201-0.257,0.437-0.49,0.707-0.689c0.271-0.201,0.568-0.34,0.9-0.42
        c0.33-0.079,0.688-0.083,1.074-0.012c0.385,0.07,0.793,0.25,1.221,0.538c0.422,0.286,0.738,0.583,0.951,0.891
        C23.289,16.126,23.425,16.43,23.49,16.727z M1.09,19.615l-0.91-0.073l0.077-0.955l0.91,0.073L1.09,19.615z M2.794,19.332
        c0.009-0.11-0.024-0.192-0.1-0.246c-0.076-0.053-0.165-0.078-0.268-0.077l0.08-0.961c0.143,0.021,0.281,0.062,0.418,0.123
        c0.134,0.06,0.253,0.146,0.356,0.256c0.101,0.108,0.18,0.246,0.236,0.41C3.572,19,3.592,19.195,3.573,19.423
        c-0.018,0.224-0.065,0.409-0.135,0.559c-0.073,0.147-0.16,0.268-0.261,0.354c-0.102,0.09-0.211,0.15-0.326,0.186
        c-0.115,0.035-0.223,0.054-0.326,0.052c-0.141-0.014-0.253-0.041-0.337-0.084c-0.085-0.043-0.153-0.099-0.208-0.162
        c-0.052-0.064-0.096-0.136-0.129-0.213c-0.032-0.078-0.064-0.154-0.098-0.232c-0.023-0.057-0.047-0.102-0.072-0.137
        C1.656,19.707,1.629,19.68,1.6,19.66c-0.03-0.023-0.064-0.039-0.102-0.051c-0.04-0.01-0.086-0.018-0.138-0.021l0.069-0.851
        c0.047,0,0.105,0.002,0.176,0.008c0.074,0.006,0.148,0.021,0.223,0.047c0.075,0.025,0.147,0.062,0.217,0.115
        c0.07,0.054,0.126,0.123,0.167,0.217c0.016,0.039,0.033,0.082,0.05,0.135c0.017,0.05,0.038,0.1,0.06,0.146
        c0.023,0.049,0.052,0.088,0.086,0.121c0.033,0.034,0.076,0.055,0.129,0.059C2.694,19.594,2.779,19.512,2.794,19.332z M25.117,6.675
        l0.254,0.878l-0.923,0.266L24.195,6.94L25.117,6.675z M23.154,5.905c-0.031-0.141-0.043-0.287-0.033-0.435
        c0.008-0.148,0.047-0.289,0.111-0.424C23.3,4.912,23.4,4.79,23.535,4.679c0.131-0.11,0.309-0.197,0.525-0.26
        c0.215-0.062,0.405-0.085,0.569-0.071c0.164,0.015,0.308,0.056,0.425,0.119c0.116,0.063,0.213,0.143,0.286,0.24
        c0.072,0.096,0.127,0.191,0.162,0.286c0.039,0.137,0.054,0.252,0.041,0.347c-0.012,0.094-0.037,0.177-0.078,0.25
        c-0.041,0.074-0.092,0.137-0.153,0.196c-0.062,0.057-0.121,0.114-0.185,0.175c-0.043,0.04-0.078,0.079-0.103,0.116
        c-0.024,0.034-0.043,0.07-0.051,0.104c-0.01,0.035-0.014,0.073-0.01,0.114c0.004,0.04,0.012,0.085,0.027,0.135l-0.82,0.236
        c-0.016-0.043-0.033-0.099-0.053-0.166c-0.021-0.072-0.033-0.147-0.037-0.227c-0.002-0.078,0.008-0.16,0.031-0.243
        c0.023-0.085,0.072-0.161,0.145-0.233c0.031-0.029,0.066-0.06,0.107-0.095c0.041-0.034,0.078-0.068,0.115-0.106
        c0.035-0.038,0.062-0.078,0.082-0.123c0.02-0.043,0.021-0.09,0.008-0.141c-0.043-0.151-0.15-0.201-0.322-0.153
        c-0.105,0.032-0.17,0.093-0.193,0.182c-0.021,0.089-0.016,0.182,0.023,0.276L23.154,5.905z M18.018,8.736l0.557,0.055l-0.053,0.531
        l-0.556-0.056L18.018,8.736z M18.238,8.007l-0.561-0.054c0.012-0.084,0.038-0.165,0.073-0.243c0.037-0.079,0.088-0.147,0.153-0.206
        c0.062-0.058,0.146-0.105,0.242-0.135c0.097-0.031,0.209-0.039,0.342-0.026c0.13,0.013,0.238,0.041,0.322,0.084
        c0.086,0.042,0.154,0.095,0.205,0.155c0.049,0.06,0.084,0.124,0.104,0.191c0.02,0.068,0.025,0.13,0.025,0.19
        c-0.008,0.083-0.025,0.147-0.054,0.196c-0.026,0.05-0.059,0.089-0.096,0.121c-0.039,0.028-0.08,0.052-0.125,0.071
        c-0.045,0.018-0.093,0.036-0.14,0.056c-0.03,0.014-0.059,0.026-0.08,0.041c-0.021,0.015-0.037,0.029-0.049,0.046
        c-0.014,0.017-0.022,0.037-0.028,0.06c-0.009,0.024-0.013,0.05-0.015,0.079l-0.494-0.047c0-0.028,0.002-0.062,0.008-0.103
        c0.004-0.044,0.014-0.086,0.027-0.13s0.039-0.086,0.069-0.126c0.031-0.041,0.074-0.072,0.129-0.097
        c0.022-0.007,0.05-0.017,0.078-0.028c0.031-0.009,0.06-0.02,0.086-0.032c0.026-0.013,0.052-0.029,0.07-0.05
        c0.021-0.019,0.032-0.044,0.034-0.074c0.009-0.09-0.039-0.141-0.143-0.152c-0.064-0.006-0.113,0.014-0.145,0.057
        C18.247,7.894,18.234,7.947,18.238,8.007z M15.08,20.016c0.02,0.069,0.027,0.131,0.025,0.189c-0.008,0.084-0.024,0.147-0.051,0.197
        c-0.027,0.049-0.06,0.09-0.098,0.118c-0.039,0.03-0.08,0.056-0.125,0.073c-0.046,0.02-0.091,0.036-0.138,0.057
        c-0.032,0.012-0.059,0.025-0.08,0.04c-0.021,0.017-0.038,0.028-0.051,0.046c-0.012,0.019-0.022,0.039-0.028,0.061
        c-0.007,0.023-0.012,0.051-0.016,0.078l-0.495-0.047c0.001-0.027,0.004-0.062,0.008-0.104c0.004-0.043,0.013-0.086,0.029-0.129
        c0.014-0.043,0.037-0.085,0.068-0.126c0.032-0.041,0.074-0.072,0.129-0.095c0.023-0.01,0.049-0.02,0.078-0.028
        c0.03-0.01,0.058-0.021,0.086-0.032c0.027-0.014,0.051-0.028,0.071-0.051c0.019-0.018,0.03-0.044,0.034-0.072
        c0.008-0.092-0.039-0.142-0.142-0.153c-0.066-0.006-0.113,0.015-0.145,0.058c-0.031,0.044-0.047,0.098-0.047,0.155l-0.56-0.055
        c0.012-0.084,0.038-0.166,0.074-0.242c0.036-0.08,0.089-0.147,0.153-0.207s0.145-0.104,0.242-0.135
        c0.095-0.031,0.209-0.039,0.341-0.026c0.132,0.012,0.24,0.04,0.324,0.084c0.087,0.044,0.154,0.094,0.204,0.155
        C15.021,19.885,15.057,19.95,15.08,20.016z M13.973,20.98l0.558,0.056l-0.051,0.528l-0.557-0.054L13.973,20.98z M3.407,4.021
        L2.845,3.966C2.858,3.883,2.884,3.803,2.92,3.724c0.038-0.078,0.088-0.147,0.153-0.207c0.064-0.058,0.145-0.104,0.241-0.134
        c0.096-0.031,0.21-0.039,0.342-0.027c0.131,0.013,0.24,0.041,0.327,0.085c0.085,0.042,0.153,0.094,0.203,0.155
        c0.05,0.06,0.084,0.123,0.104,0.191c0.019,0.068,0.027,0.13,0.026,0.193C4.308,4.061,4.29,4.126,4.264,4.176
        c-0.027,0.048-0.06,0.087-0.097,0.119c-0.038,0.028-0.08,0.052-0.125,0.071C3.996,4.384,3.95,4.404,3.904,4.422
        C3.872,4.436,3.845,4.448,3.825,4.463c-0.022,0.015-0.04,0.028-0.052,0.046c-0.011,0.017-0.021,0.037-0.028,0.06
        C3.738,4.591,3.733,4.619,3.73,4.646L3.234,4.6c0.002-0.027,0.004-0.061,0.009-0.103c0.004-0.043,0.013-0.085,0.028-0.13
        C3.287,4.325,3.309,4.283,3.34,4.242c0.031-0.041,0.073-0.071,0.129-0.096c0.022-0.007,0.048-0.017,0.077-0.027
        c0.03-0.009,0.058-0.021,0.087-0.034C3.66,4.073,3.684,4.056,3.704,4.036c0.02-0.018,0.03-0.044,0.033-0.074
        C3.746,3.87,3.7,3.82,3.596,3.809C3.531,3.803,3.483,3.822,3.452,3.866C3.421,3.91,3.406,3.962,3.407,4.021z M3.188,4.751
        l0.557,0.055l-0.053,0.53L3.135,5.281L3.188,4.751z M4.565,15.31l-1.392,0.4l-0.381-1.324l1.392-0.4L4.565,15.31z M1.219,12.824
        c-0.048-0.215-0.062-0.432-0.052-0.655c0.015-0.224,0.071-0.436,0.173-0.639c0.098-0.203,0.252-0.39,0.452-0.556
        c0.202-0.167,0.468-0.296,0.798-0.393c0.325-0.094,0.612-0.127,0.86-0.105c0.246,0.022,0.46,0.082,0.635,0.179
        c0.178,0.096,0.322,0.218,0.433,0.36c0.111,0.147,0.194,0.291,0.246,0.434c0.059,0.206,0.079,0.381,0.063,0.522
        c-0.017,0.143-0.057,0.268-0.12,0.379c-0.062,0.109-0.138,0.208-0.23,0.294c-0.091,0.088-0.183,0.176-0.278,0.265
        c-0.064,0.064-0.116,0.121-0.153,0.176c-0.037,0.053-0.063,0.105-0.077,0.159c-0.014,0.053-0.019,0.109-0.013,0.17
        c0.005,0.06,0.02,0.13,0.041,0.206l-1.238,0.355c-0.023-0.065-0.05-0.149-0.078-0.252c-0.033-0.107-0.051-0.22-0.056-0.34
        c-0.005-0.119,0.009-0.241,0.048-0.368c0.035-0.127,0.108-0.243,0.217-0.351c0.047-0.044,0.099-0.091,0.161-0.144
        c0.064-0.05,0.122-0.104,0.174-0.161c0.055-0.058,0.096-0.119,0.124-0.186c0.032-0.066,0.034-0.135,0.013-0.212
        c-0.065-0.226-0.227-0.304-0.486-0.229c-0.16,0.044-0.258,0.136-0.292,0.271c-0.032,0.136-0.023,0.274,0.034,0.419L1.219,12.824z
        M16.286,3.614l0.381,1.323l-1.392,0.4l-0.38-1.323L16.286,3.614z M13.322,2.452c-0.047-0.215-0.063-0.432-0.05-0.656
        c0.014-0.224,0.07-0.437,0.17-0.64c0.1-0.202,0.252-0.388,0.454-0.555c0.2-0.166,0.467-0.297,0.797-0.392
        c0.325-0.094,0.612-0.128,0.86-0.107c0.247,0.024,0.459,0.085,0.637,0.18s0.322,0.216,0.434,0.362
        c0.111,0.144,0.191,0.288,0.246,0.433c0.059,0.206,0.076,0.38,0.062,0.521c-0.019,0.143-0.058,0.269-0.121,0.38
        c-0.062,0.109-0.138,0.207-0.23,0.293c-0.09,0.087-0.184,0.176-0.275,0.266C16.238,2.6,16.188,2.656,16.15,2.712
        c-0.037,0.054-0.062,0.107-0.077,0.16c-0.015,0.051-0.019,0.108-0.015,0.17c0.008,0.06,0.021,0.13,0.043,0.205l-1.238,0.355
        c-0.023-0.065-0.051-0.15-0.08-0.253c-0.032-0.106-0.05-0.218-0.055-0.339c-0.004-0.119,0.01-0.241,0.047-0.367
        c0.036-0.127,0.109-0.244,0.218-0.353c0.047-0.043,0.1-0.089,0.162-0.142c0.062-0.052,0.119-0.106,0.174-0.161
        c0.053-0.058,0.096-0.119,0.123-0.186c0.031-0.067,0.033-0.137,0.014-0.213C15.4,1.361,15.238,1.285,14.98,1.356
        c-0.16,0.047-0.258,0.138-0.291,0.273c-0.033,0.136-0.023,0.276,0.033,0.419L13.322,2.452z M7.677,18l-1.065-0.2
        c0.041-0.159,0.103-0.31,0.187-0.455c0.083-0.142,0.191-0.265,0.326-0.367c0.134-0.101,0.298-0.174,0.487-0.217
        c0.189-0.044,0.41-0.043,0.661,0.004c0.25,0.046,0.452,0.119,0.609,0.217c0.157,0.1,0.278,0.211,0.364,0.332
        c0.086,0.124,0.142,0.256,0.168,0.389s0.032,0.256,0.018,0.369c-0.028,0.154-0.073,0.277-0.132,0.367
        c-0.06,0.092-0.127,0.159-0.206,0.215c-0.079,0.051-0.162,0.09-0.252,0.115c-0.09,0.028-0.181,0.057-0.273,0.084
        c-0.064,0.02-0.118,0.041-0.161,0.066c-0.042,0.021-0.078,0.047-0.105,0.079c-0.025,0.029-0.047,0.065-0.065,0.106
        c-0.016,0.043-0.03,0.095-0.041,0.151l-0.943-0.179c0.007-0.049,0.017-0.115,0.032-0.193c0.014-0.081,0.041-0.162,0.077-0.246
        c0.036-0.081,0.087-0.157,0.154-0.229c0.067-0.072,0.154-0.125,0.262-0.162c0.046-0.014,0.097-0.023,0.156-0.038
        c0.06-0.015,0.114-0.031,0.17-0.052c0.054-0.019,0.103-0.045,0.145-0.08c0.041-0.034,0.067-0.078,0.079-0.141
        c0.032-0.171-0.05-0.275-0.247-0.312c-0.122-0.023-0.219,0.005-0.285,0.082C7.729,17.787,7.689,17.885,7.677,18z M7.138,19.367
        l1.06,0.197L8.01,20.573l-1.06-0.198L7.138,19.367z"/>
    </g>
    </svg>
  )
}