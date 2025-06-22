import { useState, useEffect } from "react";
// @ts-ignore
import { vocabularyData } from "../data/vocabularyData.js";

// CSS-in-JS with responsive utilities
const getResponsiveStyles = () => {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  
  return {
    isMobile,
    isTablet
  };
};

export default function FlashcardApp() {
  const [currentTopic, setCurrentTopic] = useState("People & Family");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [languageDirection, setLanguageDirection] = useState("DE→EN"); // DE→EN or EN→DE
  const [, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentVocabulary = vocabularyData[currentTopic as keyof typeof vocabularyData];
  const currentCard = currentVocabulary[currentIndex];
  const { isMobile, isTablet } = getResponsiveStyles();

  const topics = Object.keys(vocabularyData).map(key => ({
    key,
    label: key
  }));

  const handleTopicChange = (topic: string) => {
    setCurrentTopic(topic);
    setCurrentIndex(0);
    setCurrentSentenceIndex(0);
    setIsAnswerRevealed(false);
  };

  const handleLanguageSwitch = (direction: string) => {
    setLanguageDirection(direction as "DE→EN" | "EN→DE");
    setIsAnswerRevealed(false);
  };

  const handleRevealToggle = () => {
    setIsAnswerRevealed(!isAnswerRevealed);
  };

  const handleNext = () => {
    if (currentIndex < currentVocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentSentenceIndex(0);
      setIsAnswerRevealed(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentSentenceIndex(0);
      setIsAnswerRevealed(false);
    }
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < currentCard.germanSentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
    }
  };

  const handlePreviousSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
    }
  };

  const getFrontText = () => {
    if (languageDirection === "DE→EN") {
      return currentCard.article ? `${currentCard.article} ${currentCard.german.split(' ').slice(1).join(' ')}` : currentCard.german;
    } else {
      return currentCard.english;
    }
  };

  const getBackText = () => {
    if (languageDirection === "DE→EN") {
      return currentCard.english;
    } else {
      return currentCard.article ? `${currentCard.article} ${currentCard.german.split(' ').slice(1).join(' ')}` : currentCard.german;
    }
  };

  const getPartOfSpeechText = () => {
    if (currentCard.gender) {
      return `${currentCard.partOfSpeech}: ${currentCard.gender}`;
    }
    return currentCard.partOfSpeech;
  };

  const getCurrentGermanSentence = () => {
    return currentCard.germanSentences[currentSentenceIndex];
  };

  const getCurrentEnglishSentence = () => {
    return currentCard.englishSentences[currentSentenceIndex];
  };

  // Responsive styles
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    padding: isMobile ? '10px' : isTablet ? '15px' : '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const mainCardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: isMobile ? '95vw' : isTablet ? '90vw' : '800px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: isMobile ? '16px' : '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: isMobile ? '16px' : isTablet ? '20px' : '25px',
    position: 'relative',
    overflow: 'hidden'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: isMobile ? '16px' : '25px',
    position: 'relative',
    zIndex: 1
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? '20px' : isTablet ? '24px' : '28px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '6px',
    letterSpacing: '-0.02em'
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#64748b',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '500',
    opacity: 0.8
  };

  const topicSectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: isMobile ? 'center' : 'flex-end',
    alignItems: 'center',
    marginBottom: isMobile ? '12px' : '15px',
    position: 'relative',
    zIndex: 1,
    gap: isMobile ? '8px' : '12px'
  };

  const topicLabelStyle: React.CSSProperties = {
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const selectStyle: React.CSSProperties = {
    padding: isMobile ? '8px 12px' : '10px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    background: 'white',
    fontSize: isMobile ? '13px' : '15px',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#334155',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    width: isMobile ? '100%' : 'auto',
    maxWidth: isMobile ? '280px' : 'none'
  };

  const languageControlStyle: React.CSSProperties = {
    position: 'absolute',
    top: isMobile ? '10px' : '15px',
    right: isMobile ? '10px' : '20px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const languageLabelStyle: React.CSSProperties = {
    fontSize: isMobile ? '10px' : '11px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    opacity: 0.8
  };

  const languageSelectStyle: React.CSSProperties = {
    padding: isMobile ? '6px 10px' : '8px 12px',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    fontSize: isMobile ? '11px' : '12px',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#667eea',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(102, 126, 234, 0.1)',
    minWidth: isMobile ? '80px' : '90px'
  };



  const flashCardContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isMobile ? '20px' : '25px',
    position: 'relative',
    zIndex: 1,
    gap: isMobile ? '8px' : '16px'
  };

  const flashCardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: isMobile ? '100%' : isTablet ? '340px' : '360px',
    height: isMobile ? 'auto' : isTablet ? '200px' : '220px',
    minHeight: isMobile ? '180px' : 'auto',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: isMobile ? '16px' : '20px',
    boxShadow: isAnswerRevealed 
      ? '0 20px 40px rgba(118, 75, 162, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
      : '0 15px 35px rgba(102, 126, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isMobile ? '20px 16px' : '25px',
    textAlign: 'center',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    position: 'relative',
    overflow: 'hidden'
  };

  const cardTextStyle: React.CSSProperties = {
    fontSize: isMobile ? '24px' : isTablet ? '28px' : '32px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '12px',
    lineHeight: '1.2',
    transform: isAnswerRevealed ? 'scale(1.02)' : 'scale(1)',
    transition: 'transform 0.3s ease',
    wordBreak: 'break-word'
  };

  const partOfSpeechStyle: React.CSSProperties = {
    fontSize: isMobile ? '13px' : '16px',
    color: '#64748b',
    textTransform: 'capitalize',
    fontWeight: '600',
    padding: '6px 12px',
    background: 'rgba(100, 116, 139, 0.1)',
    borderRadius: '8px'
  };

  const exampleSentencesStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: isMobile ? '20px' : '30px',
    position: 'relative',
    zIndex: 1
  };

  const sentenceContainerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: isMobile ? '100%' : '600px',
    textAlign: 'center',
    padding: isMobile ? '12px' : '18px',
    background: 'rgba(248, 250, 252, 0.8)',
    borderRadius: '16px',
    border: '1px solid rgba(226, 232, 240, 0.5)'
  };

  const sentenceHeaderStyle: React.CSSProperties = {
    marginBottom: '12px', 
    fontWeight: '700',
    fontSize: isMobile ? '11px' : '13px',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '8px' : '12px',
    flexWrap: 'wrap'
  };

  const sentenceNavButtonStyle = (disabled: boolean): React.CSSProperties => ({
    padding: isMobile ? '8px 12px' : '6px 10px',
    border: disabled ? '1px solid #e2e8f0' : '1px solid #667eea',
    borderRadius: '8px',
    background: disabled ? '#f8fafc' : 'white',
    color: disabled ? '#94a3b8' : '#667eea',
    fontSize: isMobile ? '14px' : '12px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    minHeight: '36px',
    minWidth: '36px',
    WebkitTapHighlightColor: disabled ? 'transparent' : 'rgba(102, 126, 234, 0.2)'
  });

  const cardNavButtonStyle = (disabled: boolean): React.CSSProperties => ({
    padding: isMobile ? '12px 16px' : '16px 20px',
    border: disabled ? '2px solid #e2e8f0' : '2px solid #667eea',
    borderRadius: '50%',
    background: disabled ? '#f8fafc' : 'white',
    color: disabled ? '#94a3b8' : '#667eea',
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: disabled ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.15)',
    minHeight: isMobile ? '48px' : '56px',
    minWidth: isMobile ? '48px' : '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    WebkitTapHighlightColor: disabled ? 'transparent' : 'rgba(102, 126, 234, 0.2)'
  });

  const sentenceTextStyle: React.CSSProperties = {
    fontSize: isMobile ? '16px' : '18px',
    color: '#334155',
    lineHeight: '1.5',
    fontWeight: '500'
  };

  const revealButtonStyle: React.CSSProperties = {
    padding: isMobile ? '14px 24px' : '16px 32px',
    border: 'none',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: isMobile ? '15px' : '17px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateY(0)',
    minWidth: isMobile ? '160px' : '180px',
    minHeight: '48px',
    WebkitTapHighlightColor: 'rgba(118, 75, 162, 0.3)'
  };

  const progressStyle: React.CSSProperties = {
    marginTop: isMobile ? '16px' : '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    zIndex: 1,
    flexDirection: isMobile ? 'column' : 'row'
  };

  const progressBarStyle: React.CSSProperties = {
    width: isMobile ? '80%' : '200px',
    maxWidth: '300px',
    height: '6px',
    background: '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden'
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '3px',
    width: `${((currentIndex + 1) / currentVocabulary.length) * 100}%`,
    transition: 'width 0.3s ease'
  };

  const progressTextStyle: React.CSSProperties = {
    fontSize: isMobile ? '12px' : '14px',
    color: '#64748b',
    fontWeight: '600'
  };

  return (
    <div style={containerStyle} className="flashcard-container">
      {/* Main Card Container */}
      <div style={mainCardStyle} className="flashcard-main">
        {/* Decorative Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(30px)'
        }} />

        {/* Language Direction Control - Subtle top-right placement */}
        <div style={languageControlStyle}>
          <span style={languageLabelStyle}>
            Direction:
          </span>
          <select
            value={languageDirection}
            onChange={(e) => handleLanguageSwitch(e.target.value)}
            style={languageSelectStyle}
          >
            <option value="DE→EN">DE→EN</option>
            <option value="EN→DE">EN→DE</option>
          </select>
        </div>

        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            German Flashcards
          </h1>
          <p style={subtitleStyle}>
            Master German vocabulary with interactive cards
          </p>
        </div>

        {/* Topics Dropdown - Back to original location */}
        <div style={topicSectionStyle}>
          <span style={topicLabelStyle}>
            Topic:
          </span>
          <select
            value={currentTopic}
            onChange={(e) => handleTopicChange(e.target.value)}
            style={selectStyle}
          >
            {topics.map(topic => (
              <option key={topic.key} value={topic.key}>
                {topic.label}
              </option>
            ))}
          </select>
        </div>

        {/* Flash Card with Navigation */}
        <div style={flashCardContainerStyle}>
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            style={cardNavButtonStyle(currentIndex === 0)}
          >
            {isMobile ? '‹' : '◀'}
          </button>

          <div style={flashCardStyle}>
            {/* Card decorative element */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: isAnswerRevealed 
                ? 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)'
                : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
            }} />
            
            <div style={cardTextStyle}>
              {isAnswerRevealed ? getBackText() : getFrontText()}
            </div>
            <div style={partOfSpeechStyle}>
              {getPartOfSpeechText()}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentIndex === currentVocabulary.length - 1}
            style={cardNavButtonStyle(currentIndex === currentVocabulary.length - 1)}
          >
            {isMobile ? '›' : '▶'}
          </button>
        </div>

        {/* Example Sentences */}
        <div style={exampleSentencesStyle}>
          <div style={sentenceContainerStyle}>
            <div style={sentenceHeaderStyle}>
              <button
                onClick={handlePreviousSentence}
                disabled={currentSentenceIndex === 0}
                style={sentenceNavButtonStyle(currentSentenceIndex === 0)}
              >
                {isMobile ? '‹' : '◀'}
              </button>
              <span>Example Sentences</span>
              <button
                onClick={handleNextSentence}
                disabled={currentSentenceIndex === currentCard.germanSentences.length - 1}
                style={sentenceNavButtonStyle(currentSentenceIndex === currentCard.germanSentences.length - 1)}
              >
                {isMobile ? '›' : '▶'}
              </button>
            </div>
            <div style={{ 
              marginBottom: '12px', 
              fontSize: isMobile ? '11px' : '12px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              {currentSentenceIndex + 1} / {currentCard.germanSentences.length}
            </div>
            {!isAnswerRevealed ? (
              <div style={sentenceTextStyle}>
                {languageDirection === "DE→EN" ? getCurrentGermanSentence() : getCurrentEnglishSentence()}
              </div>
            ) : (
              <div>
                <div style={{
                  ...sentenceTextStyle,
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {getCurrentGermanSentence()}
                </div>
                <div style={{
                  ...sentenceTextStyle,
                  color: '#64748b'
                }}>
                  {getCurrentEnglishSentence()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reveal Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: isMobile ? '20px' : '30px',
          position: 'relative',
          zIndex: 1
        }}>
          <button
            onClick={handleRevealToggle}
            style={revealButtonStyle}
          >
            {isAnswerRevealed ? 'Hide Answer' : 'Show Answer'}
          </button>
        </div>

        {/* Progress Indicator */}
        <div style={progressStyle}>
          <div style={progressBarStyle}>
            <div style={progressFillStyle} />
          </div>
          <span style={progressTextStyle}>
            {currentIndex + 1} / {currentVocabulary.length}
          </span>
        </div>
      </div>
    </div>
  );
}