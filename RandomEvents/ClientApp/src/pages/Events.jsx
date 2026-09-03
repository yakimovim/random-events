import { useLoaderData } from "react-router-dom";

export function Events() {
  const data = useLoaderData();

  console.log(data);

  return <div>Events</div>;
}
