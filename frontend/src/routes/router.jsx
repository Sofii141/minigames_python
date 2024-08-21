import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Home } from "../pages/Home";
import { Instructors } from "../pages/Instructors/Instructors";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      children:[
        {
            path:"/",
            element: <Home/>
        },
        {
            path:"instructors",
            element:<Instructors/>
        }
      ]
    },
  ]);