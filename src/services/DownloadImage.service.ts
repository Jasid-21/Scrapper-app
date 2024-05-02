export default async function DownloadImage(imageSrc: string) {
  if (!imageSrc) return;
  console.log(imageSrc);

  const image = await fetch(imageSrc);
  const imageBlob = await image.blob();
  const imageURL = URL.createObjectURL(imageBlob);

  const name = imageSrc.split('/').pop();
  console.log(name);

  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = imageURL;
  link.download = (name || 'image') + '.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
