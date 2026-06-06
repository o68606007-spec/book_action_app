import { memo, FC, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuthContext } from "../context/AuthContext";
import { getActionsLogTableLib } from "../lib/GetActionsLogTableLib";
import { getActionsTableLib } from "../lib/GetActionsTableLib";
import { LogoutButton } from "./atom/LogoutButton";
import { GoHomeButton } from "./atom/GoHomeButton";

type actions = {
    id: number;
    content: string;
}

type logs = {
    id: number;
    action_id: number;
    executed_at: string;
    is_done: boolean;
    actions: {
        content: string;
    }
};


export const Analysis: FC = memo(() => {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const today = new Date().toISOString().split("T")[0];

    const [actions, setActions] = useState<actions[]>([]);
    const [actionsLogs, setActionsLogs] = useState<logs[]>([]);

    const todayLogs = actionsLogs.filter((log) => log.executed_at.split("T")[0] === today);

    const uniqueDates = [...new Set(actionsLogs.map(log => log.executed_at.split("T")[0]))];

    const totalActions = actions.length;

    const todayTotalCompletedActions = todayLogs.length;

    const rate = totalActions > 0 ? Math.floor((todayTotalCompletedActions / totalActions) * 100) : 0;

    useEffect(() => {
        (
            async () => {
                const fetchData = async () => {
                    const logsData = await getActionsLogTableLib();
                    if (logsData?.data) {
                        setActionsLogs(logsData?.data);
                    }
                    const actionData = await getActionsTableLib();
                    if (actionData?.data) {
                        setActions(actionData?.data);
                    }
                }
                fetchData();
            }
        )()
    },[])

    return (
        <>
            <h1>継続分析</h1>

            <hr />

            <h2>全体分析</h2>

            <p>総継続日数: {uniqueDates.length}日</p>

            <p>総行動数: {totalActions}</p>

            <p>今日の実行率: {rate}%</p>

            <hr />

            <h2>行動別分析</h2>
            {actions.map((action) => {
                const actionspatternLogs = actionsLogs.filter(log => log.action_id === action.id);
                const actionUniqueDates = [...new Set(actionspatternLogs.map(log => log.executed_at.split("T")[0]))];

                const todayCompleted = actionspatternLogs.filter((log) => log.executed_at.split("T")[0] === today).length;

                const actionRate = todayCompleted > 0 ? 100 : 0;

                const actionCount = actionspatternLogs.length;
                return (
                <div key={action.id} style={{ border: "1px solid gray", padding: "12px", marginBottom: "12px", borderRadius: "8px" }}>
                    <p>行動内容: {action.content}</p>
                    <p>継続日数: {actionUniqueDates.length}日</p>
                    <p>実行率: {actionRate}%</p>
                    <p>実行回数: {actionCount}</p>
                </div>
                )
            })}
            <Link to="/book">本一覧画面はこちら</Link>
            <GoHomeButton />
            <LogoutButton />
        </>
    )
    }    
)