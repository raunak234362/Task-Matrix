export const nameExtractor = (user) => {
    return [user?.f_name, user?.m_name, user?.l_name].filter(Boolean).join(' ');
}