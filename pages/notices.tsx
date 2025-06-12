import { useEffect, useState } from "react";
import axios from "axios";

type Notice = {
  _id: string;
  title?: string;
  content?: string;
  date: string;
  type: string;
  professor: string;
  courseName: string;
};

type MeResponse = {
  user: {
    role: string;
  };
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get<MeResponse>("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserRole(res.data.user.role);
        })
        .catch(() => {
          setUserRole(null);
        });
    }
  }, []);

  useEffect(() => {
    fetch("/api/notices")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNotices(data);
        } else {
          console.error("응답이 배열이 아닙니다:", data);
          setNotices([]);
        }
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.request({
        url: "/api/notices",
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id }, // 여기서 더 이상 오류 안 납니다.
      });

      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert("삭제 실패");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📄 등록된 휴·보강 알림</h1>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b font-semibold">
            <th className="py-2">강의</th>
            <th className="py-2">교수명</th>
            <th className="py-2">날짜</th>
            <th className="py-2">상태</th>
            {userRole === "professor" && <th className="py-2">관리</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="py-4 text-center">불러오는 중...</td>
            </tr>
          ) : notices.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-4 text-center">등록된 알림이 없습니다.</td>
            </tr>
          ) : (
            notices.map((n) => (
              <tr key={n._id} className="border-b">
                <td className="py-2">{n.courseName}</td>
                <td className="py-2">{n.professor}</td>
                <td className="py-2">{new Date(n.date).toLocaleDateString("ko-KR")}</td>
                <td className="py-2">{n.type}</td>
                {userRole === "professor" && (
                  <td className="py-2">
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="text-red-600 hover:underline"
                    >
                      삭제
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
