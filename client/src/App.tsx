import "./index.css";
import { Router, Route, Switch } from "wouter";
import Dashboard from "@/pages/dashboard";

function App() {
  console.log("App with minimal routing rendering.");
  return (
    <Router>
      <div className="flex flex-col min-h-screen" style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
        <header style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
          <strong>StartupsAI</strong> — Development Preview
        </header>
        <main style={{ padding: '24px' }}>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route>Not found</Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;