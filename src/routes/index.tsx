import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <main>
      <Link to="/recorder">记录器</Link>
    </main>
  );
}
