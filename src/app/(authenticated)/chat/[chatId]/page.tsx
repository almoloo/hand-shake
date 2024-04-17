export default function page({ params }: { params: { chatId: string } }) {
  return <div>page: {params.chatId}</div>;
}
