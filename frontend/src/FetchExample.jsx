import { useEffect, useState } from "react";

function FetchExample() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>Fetched Posts</h2>

      {posts.slice(0, 10).map(post => (
        <div key={post.id} style={{ border:"1px solid black", margin:"10px", padding:"10px" }}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

export default FetchExample;
