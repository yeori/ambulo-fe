export default {
  success: {
    _: '권한 획득 성공',
    ko: '[성공] 권한 획득 완료',
    en: '[OK] Permission approved.'
  },
  error: {
    user: {
      _: '사용자가 권한 거절',
      ko: '위치 접근 권한을 얻지 못했습니다.',
      en: "You've reject the access privillage."
    },
    system: {
      _: '위치정보 접근 불가',
      ko: '위치를 알 수 없습니다. GPS를 켜주세요.',
      en: 'Check your GPS.'
    },
    timeout: {
      _: '시간초관',
      ko: '시간 초과',
      en: 'Timeout'
    }
  }
}
