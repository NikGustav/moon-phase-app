const sampleInbox = [
  {
    id: 'msg1',
    text: '今天的月亮很亮，希望你也被照亮。',
    date: '2025-03-25',
    replied: false
  },
  {
    id: 'msg2',
    text: '我梦见了小时候的房间。',
    date: '2025-03-24',
    replied: false
  }
];

Page({
  data: {
    stars: [],
    moonPhase: '下弦月',
    outboxText: '',
    replyText: '',
    hasSubmitted: false,
    showInbox: false,
    hasReplied: false,
    receivedMessage: ''
  },

  onLoad() {
    this.createStars();
    this.initializeMessage();
    this.getMoonPhase();
  },

  createStars() {
    const stars = [];
    const numberOfStars = 50;

    for (let i = 0; i < numberOfStars; i++) {
      stars.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3
      });
    }

    this.setData({ stars });
  },

  initializeMessage() {
    const randomMessage = sampleInbox[Math.floor(Math.random() * sampleInbox.length)];
    this.setData({
      receivedMessage: randomMessage.text
    });
  },

  async getMoonPhase() {
    try {
      const timestamp = Date.now();
      const response = await wx.request({
        url: `https://api.farmsense.net/v1/moonphases/${timestamp}`,
        method: 'GET'
      });

      if (response.statusCode === 200) {
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          const moonPhase = data[0];
          const phase = moonPhase.Phase;
          let phaseText = '';

          if (phase >= 0 && phase < 6.25) phaseText = '新月';
          else if (phase < 18.75) phaseText = '蛾眉月';
          else if (phase < 31.25) phaseText = '上弦月';
          else if (phase < 43.75) phaseText = '盈凸月';
          else if (phase < 56.25) phaseText = '满月';
          else if (phase < 68.75) phaseText = '亏凸月';
          else if (phase < 81.25) phaseText = '下弦月';
          else if (phase < 93.75) phaseText = '残月';
          else phaseText = '新月';

          this.setData({ moonPhase: phaseText });
        }
      }
    } catch (error) {
      console.error('获取月相信息失败:', error);
    }
  },

  handleSend() {
    const { outboxText } = this.data;
    if (!outboxText.trim()) return;

    this.setData({
      hasSubmitted: true
    });

    setTimeout(() => {
      this.setData({
        showInbox: true
      });
    }, 1000);
  },

  handleReply() {
    const { replyText } = this.data;
    if (!replyText.trim()) return;

    this.setData({
      hasReplied: true
    });
  }
}); 