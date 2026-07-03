import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'talentflow_db.json');
if (fs.existsSync(filePath)) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (data.users) {
    const user = data.users.find((u: any) => u.email === 'wahahasha@gmail.com');
    if (user) {
      user.psychResults = {};
      user.quizScoresLog = [];
      user.aiReport = null;
      if (user.profile && user.profile.stats) {
        user.profile.stats = Object.assign({}, user.profile.stats, {
          ovr: 0, acd: 0, spd: 0, con: 0, str: 0, com: 0, ldr: 0, dtl: 0
        });
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log('Wiped scores for wahahasha@gmail.com');
    }
  }
}
