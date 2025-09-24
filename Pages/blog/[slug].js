import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function BlogPost({ post }) {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 my-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p>{post.content}</p>
      </main>
      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const post = { title: "Sample Blog", content: "This is a sample blog post content." };
  return { props: { post } };
}