
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateMemberData = () => {
    const data = [];
    const months = ["January", "February", "March", "April", "May", "June"];
    for (const month of months) {
        data.push({ month, members: random(150, 350) });
    }
    return data;
};

const generateEventPerformanceData = () => {
    const events = ['Diwali Gala', 'Holi Fest', 'Startup Meet', 'Yoga Day', 'Food Fest'];
    return events.map(name => {
        const registrations = random(100, 800);
        const attendance = Math.floor(registrations * (random(75, 95) / 100));
        return { name, registrations, attendance };
    });
};

const generateTopReferrersData = () => {
    const sources = ['Facebook', 'Instagram', 'Google Search', 'Word of Mouth'];
    const data = sources.map(source => ({ source, count: random(20, 120) }));
    const total = data.reduce((acc, item) => acc + item.count, 0);
    return data.map(item => ({ ...item, percentage: Math.round((item.count / total) * 100) }));
};


export const memberData = generateMemberData();
export const eventPerformanceData = generateEventPerformanceData();
export const topReferrersData = generateTopReferrersData();
