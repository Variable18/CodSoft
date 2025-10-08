import { useNavigate } from 'react-router-dom';
import { useTrackProgress } from '../TrackProgressContext';

function getUserDisplayName(users) {
  if (!users) return "";
  if (users.username) return users.username;
  if (users.name) return users.name;
  if (typeof users === 'string') return users;
  return "";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, projects } = useTrackProgress(); // Ensure context provides user as well
  const userDisplay = getUserDisplayName(user);
  const recentProjects = projects.slice(0, 3);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f9fb",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "3rem 1rem",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          width: "100%"
        }}
      >
        <header style={{ textAlign: "center", marginBottom: 38 }}>
          <h1 style={{
            fontWeight: 800,
            color: "#2563eb",
            fontSize: "2.5rem",
            marginBottom: 8,
            letterSpacing: "-1px"
          }}>
            Welcome{userDisplay ? `, ${userDisplay}!` : "!"}
          </h1>
          <div style={{
            fontSize: 20,
            color: "#4b5563",
            fontWeight: 500
          }}>
            A productive day starts here.
          </div>
        </header>

        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            justifyContent: "center",
            marginBottom: "2.2rem"
          }}
        >
          <div style={{
            background: "#e3edff",
            borderRadius: 13,
            padding: "2.2rem 2.8rem",
            width: 300,
            boxShadow: "0 3px 18px #3474eb24",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.13rem", marginBottom: 8, color: "#2563eb" }}>Total Projects</h3>
            <div style={{
              fontSize: "2.9rem",
              fontWeight: 800,
              color: "#222",
              marginBottom: 3
            }}>
              {projects.length}
            </div>
            <div style={{
              fontSize: "1.04rem",
              color: "#697488"
            }}>
              projects created
            </div>
          </div>

          <div style={{
            background: "#eeffee",
            borderRadius: 13,
            padding: "2.2rem 2.8rem",
            width: 300,
            boxShadow: "0 3px 18px #c2f0c2be",
            textAlign: "center"
          }}>
            <h3 style={{
              fontSize: "1.13rem",
              marginBottom: 10,
              color: "#25a244"
            }}>Quick Actions</h3>
            <button
              style={{
                background: "#2563eb",
                color: "#fff",
                borderRadius: 8,
                padding: "10px 20px",
                fontWeight: 600,
                border: "none",
                fontSize: 16,
                marginBottom: 12,
                boxShadow: "0 2px 8px #2563eb22",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => navigate('/projects')}
            >
              + Add Project
            </button>
            <button
              style={{
                background: "#fff",
                color: "#25a244",
                borderRadius: 8,
                padding: "9px 19px",
                fontWeight: 600,
                border: "2px solid #b7ebbb",
                fontSize: 15,
                cursor: "pointer",
                width: "100%"
              }}
              onClick={() => navigate('/projects')}
            >
              View All Projects
            </button>
          </div>
        </div>

        <div style={{
          textAlign: "center",
          fontSize: "1.17rem",
          color: "#5881a5",
          fontWeight: 500,
          marginBottom: "2.6rem"
        }}>
          {projects.length === 0
            ? "Start by creating your first project. Every great journey begins with a single step!"
            : "Great work! Keep building and managing your projects."}
        </div>

        <section>
          <h2 style={{
            marginBottom: 18,
            color: "#2563eb",
            fontWeight: 700,
            fontSize: "1.16rem",
            textAlign: "left"
          }}>
            Recent Projects
          </h2>
          {recentProjects.length === 0 ? (
            <div style={{
              color: "#888",
              fontSize: 15,
              background: "#f6faff",
              padding: "1.1rem 1.4rem",
              borderRadius: 9,
              marginBottom: 12,
              textAlign: "center"
            }}>
              No projects yet. <span style={{ color: "#2563eb" }}>Add one from the Projects tab!</span>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.3rem"
              }}
            >
              {recentProjects.map(proj => (
                <div key={proj._id} style={{
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 2px 8px #3474eb17",
                  padding: "1rem 1.3rem",
                  cursor: "pointer",
                  textAlign: "left"
                }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: 17,
                    color: "#2563eb",
                    marginBottom: 6
                  }}>
                    {proj.title}
                  </div>
                  <div style={{
                    color: "#555",
                    marginBottom: 4,
                    fontSize: 15
                  }}>
                    {proj.description?.slice(0, 60) || "(No description)"}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: "#41c047"
                  }}>
                    {proj.status} &middot; {proj.priority}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
