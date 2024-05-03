export default async function FetchPage(url: string)
  : Promise<{ styles: string[], content: string }> {

  console.log("fetching...");
  const user_id = '';
  const base_url: string = process.env.VUE_APP_API_URL || '';

  const resp = await fetch(base_url + '/workspace/newPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, url }),
  });

  const ok = resp.ok;
  if (!ok) {
    alert(resp.statusText);
    return { styles: [], content: '' } ;
  }
  console.log("Status: ok");
  const json = await resp.json();
  return { styles: json.styles, content: json.body };
}
