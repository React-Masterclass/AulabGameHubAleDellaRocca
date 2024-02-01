export default function getProfileImg(fileUrl) {
    if (fileUrl !== null) {
        return 'https://icon-library.com/images/add-photo-icon/add-photo-icon-19.jpg';
    }
    return `https://cdcpqhmopaikrevfnaqi.supabase.co/storage/v1/object/public/avatars/${fileUrl}`;
}
