This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm i
# and
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
----

## About

The project provides all the basic features of a chat application. It is possible to create servers, channels in them. Channels have 3 types: Text, voice, and video.

In each channel you can communicate accordingly.

There are also private messages between server members, and voice/video chat inside.

In text channels you can send messages, edit them, delete them in real time. There is also support for uploading files and images in messages.

Also in the application is supported theming, there are 2 themes: Light and Dark.
Also the application is fully adapted for mobile devices, this helped to achieve [TailwindCSS](https://tailwindcss.com/docs/installation) and [Shadcn-ui](https://ui.shadcn.com/docs) with their pre-adaptive components and class names.

This is the basic functionality, let's look at each section in more detail

BASIC INVITATION LINK TO SERVER: https://discord-clone-production-7510.up.railway.app/invite/66870a74-0418-4c1d-8a07-f2d937a415fb

----

## Users

First, the user logs into the app, they need to authenticate via Clerk Authorization. A unique profile is created for each user in the database. Further, the user does not need to re-authorize, immediately searches for the first of the servers he is a member of, the main channel 'general' is displayed.

The user has the option to change his First and Last name in the settings, if for some reason, the user authorization method does not provide for the original content of these fields.

----

## Servers

If the user is not a member of any server, he is immediately offered to create his own, he cannot skip this step. To join any of the servers, it is enough to go to a special link-invitation, which has access to the moderator (appointed by the admin) or admin (created the server) of the server.
A server can have as many channels as you like, with three types: voice, text, and video, and, of course, contain as many members as you like.

----

## Channels
As mentioned earlier, the server contains 3 types of channels. In the text one you can communicate with all server members, edit and delete your messages. Also the administrator and moderator of the server can delete messages, but not edit them.

In voice and video, respectively communicate in voice chat, or by video.

----

## Scripts

- `npm run dev - ` application launch in development mode
- `npm run build - ` building an application for production mode via webpack
- `npm run lint - ` run the basic eslint plugin to match the predefined rules next/eslint
- `npm run add-use-memo - ` run a script written by [**ts-morph**](https://ts-morph.com/manipulation/), that automatically goes through the entire `@/components` folder and adds a `memo` import from `react` and wraps the component in `memo()`

----

## Technology Stack

The main infrastructure of the application is built on a modern framework for building fullstack applications, NextJS 13. 

A complete list of the entire technology stack is given below

- **[React 18](https://react.dev/learn)**
- **[NextJS 13](https://nextjs.org/docs)**
- **[Tailwind CSS](https://tailwindcss.com/docs/installation)**
- **[Clerk](https://clerk.com/docs/quickstarts/nextjs)**
- **[PlanetScale](https://planetscale.com/docs/concepts/what-is-planetscale)**
- **[Prisma.js](https://www.prisma.io/docs/getting-started)**
- **[react-hook-form](https://react-hook-form.com/get-started)**
- **[shadcn-ui](https://ui.shadcn.com/docs)**
- **[socket.io](https://socket.io/docs/v4/)**
- **[zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)**
- **[React Query](https://tanstack.com/query/v5/docs/react/overview)**

----

## ORM

Prisma.js, one of the most advanced solutions in this area, was chosen as ORM (Object-Oriental Mapping) technology for database querying. 

In conjunction with the [vs-code extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma), it allows you to conveniently compose models, generate a database object, as well as provides a convenient API for working with the database.

All described types in the model are installed in the project as a package, and they can be imported from any place from a single package throughout the project. 

Prisma also provides a handy prisma-studio **`(npx prisma studio)`** that allows direct interaction with the database, and supports all CRUD operations.

----

## Database

PlanetScale cloud database was chosen as the database, which makes it very easy to set up databases. I used a MySQL database from PlanetScale to store all the application information.

For uploading and distributing static files, the uploadthing service was chosen, which provides a convenient API and interaction components.

----

## Working with data

The application works with data, with the help of **Zustand** state manager, **Socket.IO** for real-time connection and subscription to events, **react-query** for some requests to the server, implementation of `Pooling` mechanism, if for some reason connection with Socket.IO server is not established. That is, if the Socket.IO server does not respond, the `Pooling` mechanism for emulation will be used, as well as the classic Axios for generating static requests to the server.

----

## Environment

The application infrastructure is built on the requirement of **Next JS** framework as it works based on the file and folder structure in the application.

Navigation and working with backend endpoints is done through the folder and file structure.

In the application, some hooks have been created in the [**hooks**](/hooks/) folder to automate and simplify the interaction with libraries.
The [**lib**](/lib/) folder contains similar utilities.

The [**components**](/components/) folder contains all the components of the application. Where possible, they have been divided into appropriate categories to summarize the functionality.

The UI was automatically generated by the **shadcn-ui** library, in which all relevant components from the library are installed [Read more](https://ui.shadcn.com/docs/components/button)

All server code is located in the folder [**app/api**](/app/api/), there are all the routers and there is also the work with the database.

The main routes are in the [**api**](/app/) folder. They are represented as organizational folders, which allows to use the `layouts` concept that was implemented in the project. 

----

## Working with forms

Although the application is not large, it contains a large number of forms. In the course of development we developed a wrapper component FormFieldWrapper, based on React.Context, which allows you to conveniently interact with props on the top level. [More about the component](/docs/form-field-wrapper.md)

----

## Real-time experience

A stack of **`Socket.IO`** and **`react-query`** was used for real-time interaction between users. With **`Socket.IO`** it is possible to track necessary events, and to change data with **`react-query`**. 

Also, the application supports working without **`Socket.IO`**.

The `pooling` mechanism is implemented, which allows to emulate real-time interaction, if for some reason the connection with Socket.IO application was not established.

----

## Difficulties during development. 

Initially the application was developed on NextJS 14 version, but due to weak support of Socket.IO in this version, as well as fresh **issues** on GitHub, I had to downgrade to the latest stable version of NextJS 13.4.12, which supports Socket.IO.

----

## Video and Audio

The app supports voice and video communication in real-time, enabled by LiveKit, a powerful open source tool built on WebRTC.

----

## ENV Structure

```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= /* Key for interaction with Clerk Authorization API */

CLERK_SECRET_KEY= /* Clerk Secret Key */

DATABASE_URL= /* Reference to the database, including authorization data */

UPLOADTHING_SECRET= /* Uploadthing's secret key  */

UPLOADTHING_APP_ID= /* Uploadthing's APP ID */

LIVEKIT_API_KEY= /* API key of LiveKit service */

LIVEKIT_API_SECRET= /* API Secret key of LiveKit service */

NEXT_PUBLIC_LIVEKIT_URL= /* Link to public domain */

```

----
