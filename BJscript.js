document.addEventListener('DOMContentLoaded', function () {
    const GameState = {
      NEW_GAME: 'NEW_GAME',
      PLAYER_TURN: 'PlAYER_TURN',
      DEALER_TURN: 'DEALER_TURN',
      GAME_OVER: 'GAME_OVER'
    };
    const currentScore = document.getElementById('current-score');
    const currentDealerScore = document.getElementById('dealer-current-score');
    const dealerCards = document.getElementById('dealer-cards');
    const playerCards = document.getElementById('player-cards');
    const newGameButton = document.getElementById('new-game');
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');
    
    /** 현 게임 상태 */
    let gameState = GameState.NEW_GAME;

    // 덱 초기화
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
    let deck = [];
  
    function createDeck() {
      deck = [];
      for (let suit of suits) {
        for (let value of values) {
          deck.push({ suit, value });
        }
      }
    }
  
    // 카드 섞기
    function shuffleDeck() {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }
  
    // 카드를 나타내는 HTML 엘리먼트 생성
    function createCardElement(card, isDealer = false) {
      const cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.textContent = card.value + ' ' + getSuitSymbol(card.suit);
      
      /** 딜러 카드면 다른 디자인 적용 */
      if (isDealer) {
      cardElement.classList.add('dealer-card');
      }

      return cardElement;
    }
  
    // 카드 덱에서 카드 하나 뽑기
    function drawCard() {
      return deck.pop();
    }
  
    // 카드 덱에서 초기 카드 두 장 뽑기
    function initialDeal() {
      return [drawCard(), drawCard()];
    }
  
    // 카드의 값을 계산 (A는 1 또는 11로 계산)
    function calculateScore(cards) {
      let score = 0;
      let hasAce = false;
  
      for (let card of cards) {
        if (card.value === 'A') {
          hasAce = true;
        }
        score += getValue(card.value);
      }
  
      if (hasAce && score + 10 <= 21) {
        score += 10;
      }
  
      return score;
    }
  
    // 카드 값에 따른 숫자 반환
    function getValue(value) {
      if (value === 'J' || value === 'Q' || value === 'K') {
        return 10;
      } else if (value === 'A') {
        return 1;
      } else {
        return parseInt(value, 10);
      }
    }
  
    /** 딜러의 카드를 보여주는 함수 */
    function showDealerCards(showAll = false) {
      dealerCards.innerHTML = '';

      for (let i = 0; i < dealerHand.length; i++) {
        const card = dealerHand[i];
        const isDealerFirstCard = i === 0 && !showAll;
        const cardElement = createCardElement(card, isDealerFirstCard);
        dealerCards.appendChild(cardElement);
      }

    if (showAll) {
      const dealerScoreElement = document.createElement('div');
      currentDealerScore.textContent = calculateScore(dealerHand);
      dealerCards.appendChild(dealerScoreElement);
      }
    }
    /** 게임 결과 확인하고 표시 함수 */
    function checkGameResult() {
      const dealerScore = calculateScore(dealerHand);
      const playerScore = calculateScore(playerHand);

      if (playerScore == 21 && playerHand.length === 2) {
        alert('블랙잭! 플레이어 승리!');
      } else if (playerScore > 21) {
        alert('버스트! 딜러 승리!');
      } else if (dealerScore > 21) {
        alert('딜러 버스트! 플레이어 승리!');         
      } else if (gameState === GameState.GAME_OVER) {
        if (playerScore > dealerScore) {
          alert('플레이어 승리!');
        } else if (playerScore < dealerScore) {
          alert('딜러 승리!');
        } else {
          alert('무승부!');
        }
      }
    }
  
    // 플레이어의 카드를 보여주는 함수
    function showPlayerCards() {
      playerCards.innerHTML = '';
      for (let card of playerHand) {
        const cardElement = createCardElement(card);
        playerCards.appendChild(cardElement);
      }
    }
  
    // 승패 결정 및 결과 표시
    function showResult() {
      const dealerScore = calculateScore(dealerHand);
      const playerScore = calculateScore(playerHand);
  
      if (dealerScore > 21 || playerScore > dealerScore && playerScore <= 21) {
        alert('플레이어 승리!');
      } else if (dealerScore === playerScore) {
        alert('무승부!');
      } else {
        alert('딜러 승리!');
      }
    }
  
    // 문양에 따른 유니코드 기호 반환
    function getSuitSymbol(suit) {
      switch (suit) {
        case 'hearts':
          return '♥';
        case 'diamonds':
          return '♦';
        case 'clubs':
          return '♣';
        case 'spades':
          return '♠';
        default:
          return '';
      }
    }
  
    let dealerHand = [];
    let playerHand = [];
  
    newGameButton.addEventListener('click', function () {
      createDeck();
      shuffleDeck();

      gameState = GameState.PLAYER_TURN;

      /** 플레이어 카드 합 21이면 블랙잭 */
      if (calculateScore(playerHand) === 21) {
        gameState = GameState.GAME_OVER;
        checkGameResult();
        hitButton.disabled = true;
        standButton.disabled = true;
      }
      dealerHand = initialDeal();
      playerHand = initialDeal();
      showDealerCards();
      showPlayerCards();
      newGameButton.disabled = true;
      hitButton.disabled = false;
      standButton.disabled = false;     
      currentScore.textContent = calculateScore(playerHand);
      currentDealerScore.textContent = calculateScore(dealerHand);
    });
  
    hitButton.addEventListener('click', function () {
      playerHand.push(drawCard());
      showPlayerCards();
      const score = calculateScore(playerHand);
      currentScore.textContent = score;
      currentDealerScore.textContent = calculateScore(dealerHand);
  
      if (score > 21) {
        gameState = GameState.GAME_OVER;
        checkGameResult();
        newGameButton.disabled = false;
        hitButton.disabled = true;
        standButton.disabled = true;
      }
    });
  
    standButton.addEventListener('click', function () {

      /** 딜러의 모든 카드를 보여줌 */
      showDealerCards(true);

      while (calculateScore(dealerHand) < 17) {
        dealerHand.push(drawCard());
        currentDealerScore.textContent = calculateScore(dealerHand);
      }
      
      gameState = GameState.GAME_OVER;
      showDealerCards(true);
      checkGameResult();
  
      newGameButton.disabled = false;
      hitButton.disabled = true;
      standButton.disabled = true;
    });
  });
  