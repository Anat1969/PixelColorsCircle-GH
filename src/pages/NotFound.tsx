import { Link, useLocation } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { NAV_ITEMS } from "@/data/site";

const NotFound = () => {
  const { pathname } = useLocation();
  return (
    <PageLayout title="הדף לא נמצא">
      <section className="newton-panel mx-auto max-w-[640px] p-8 text-center md:p-12">
        <p className="label-mono mb-3">404</p>
        <h1 className="display mb-4 text-[2.6rem]">הדף לא נמצא</h1>
        <p className="mb-2 text-newton-muted">הכתובת <span dir="ltr" className="font-mono text-newton-text">{pathname}</span> לא קיימת באפליקציה.</p>
        <p className="mb-8 text-newton-muted">אולי הקישור ישן. בחרו לאן להמשיך:</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link to="/" className="btn is-primary">לדף הבית</Link>
          {NAV_ITEMS.map(n => <Link key={n.to} to={n.to} className="btn">{n.label}</Link>)}
        </div>
      </section>
    </PageLayout>
  );
};

export default NotFound;
