import { Routes, Route, BrowserRouter } from "react-router-dom";
import { memo, FC } from "react";

import { Login } from "../components/Login";
import { Home } from "../components/Home";
import { Signup } from "../components/Signup";
import { Book } from "../components/Book";
import { BookId } from "../components/BookId";
import { Analysis } from "../components/Analysis";
import { PrivateRoute } from "./PrivateRoute";

export const Router: FC = memo(() => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                } />
                <Route path="/book" element={
                    <PrivateRoute>
                        <Book />
                    </PrivateRoute>
                } />
                <Route path="/book/:bookId" element={
                    <PrivateRoute>
                        <BookId />
                    </PrivateRoute>
                } />
                <Route path="/analysis" element={
                    <PrivateRoute>
                        <Analysis />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
})