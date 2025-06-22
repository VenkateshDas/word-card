import React, { useState } from "react";
// @ts-ignore
import { vocabularyData } from "../data/vocabularyData.js";

export default function FlashcardApp() {
  const [currentTopic, setCurrentTopic] = useState("People & Family");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [languageDirection, setLanguageDirection] = useState("DE→EN"); // DE→EN or EN→DE

  const currentVocabulary = vocabularyData[currentTopic as keyof typeof vocabularyData];
  const currentCard = currentVocabulary[currentIndex];

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

  const handleLanguageSwitch = () => {
    setLanguageDirection(prev => prev === "DE→EN" ? "EN→DE" : "DE→EN");
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      padding: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Main Card Container */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '25px',
        position: 'relative',
        overflow: 'hidden'
      }}>
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

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '25px',
          position: 'relative',
          zIndex: 1
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '6px',
            letterSpacing: '-0.02em'
          }}>
            German Flashcards
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '14px',
            fontWeight: '500',
            opacity: 0.8
          }}>
            Master German vocabulary with interactive cards
          </p>
        </div>

        {/* Topics Dropdown - Top Right */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '15px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Topic:
            </span>
            <select
              value={currentTopic}
              onChange={(e) => handleTopicChange(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                background: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                color: '#334155',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              }}
            >
              {topics.map(topic => (
                <option key={topic.key} value={topic.key}>
                  {topic.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Language Switcher - Center */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 1
        }}>
          <button
            onClick={handleLanguageSwitch}
            style={{
              padding: '10px 20px',
              border: '2px solid #667eea',
              borderRadius: '25px',
              background: languageDirection === 'DE→EN' ? '#667eea' : 'white',
              color: languageDirection === 'DE→EN' ? 'white' : '#667eea',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
              transform: 'translateY(0)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
            }}
          >
            {languageDirection}
          </button>
        </div>

        {/* Flash Card */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '25px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            width: '360px',
            height: '220px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '20px',
            boxShadow: isAnswerRevealed 
              ? '0 20px 40px rgba(118, 75, 162, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              : '0 15px 35px rgba(102, 126, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '25px',
            textAlign: 'center',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
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
            
            <div style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#1e293b',
              marginBottom: '12px',
              lineHeight: '1.2',
              transform: isAnswerRevealed ? 'scale(1.02)' : 'scale(1)',
              transition: 'transform 0.3s ease'
            }}>
              {isAnswerRevealed ? getBackText() : getFrontText()}
            </div>
            <div style={{
              fontSize: '16px',
              color: '#64748b',
              textTransform: 'capitalize',
              fontWeight: '600',
              padding: '6px 12px',
              background: 'rgba(100, 116, 139, 0.1)',
              borderRadius: '8px'
            }}>
              {getPartOfSpeechText()}
            </div>
          </div>
        </div>

        {/* Example Sentences */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            maxWidth: '600px',
            textAlign: 'center',
            padding: '18px',
            background: 'rgba(248, 250, 252, 0.8)',
            borderRadius: '16px',
            border: '1px solid rgba(226, 232, 240, 0.5)'
          }}>
            <div style={{ 
              marginBottom: '12px', 
              fontWeight: '700',
              fontSize: '13px',
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <button
                onClick={handlePreviousSentence}
                disabled={currentSentenceIndex === 0}
                style={{
                  padding: '6px 10px',
                  border: currentSentenceIndex === 0 ? '1px solid #e2e8f0' : '1px solid #667eea',
                  borderRadius: '8px',
                  background: currentSentenceIndex === 0 ? '#f8fafc' : 'white',
                  color: currentSentenceIndex === 0 ? '#94a3b8' : '#667eea',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: currentSentenceIndex === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (currentSentenceIndex !== 0) {
                    e.currentTarget.style.background = '#667eea';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentSentenceIndex !== 0) {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#667eea';
                  }
                }}
              >
                ◀
              </button>
              <span>Example Sentences</span>
              <button
                onClick={handleNextSentence}
                disabled={currentSentenceIndex === currentCard.germanSentences.length - 1}
                style={{
                  padding: '6px 10px',
                  border: currentSentenceIndex === currentCard.germanSentences.length - 1 ? '1px solid #e2e8f0' : '1px solid #667eea',
                  borderRadius: '8px',
                  background: currentSentenceIndex === currentCard.germanSentences.length - 1 ? '#f8fafc' : 'white',
                  color: currentSentenceIndex === currentCard.germanSentences.length - 1 ? '#94a3b8' : '#667eea',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: currentSentenceIndex === currentCard.germanSentences.length - 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (currentSentenceIndex !== currentCard.germanSentences.length - 1) {
                    e.currentTarget.style.background = '#667eea';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentSentenceIndex !== currentCard.germanSentences.length - 1) {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#667eea';
                  }
                }}
              >
                ▶
              </button>
            </div>
            <div style={{ 
              marginBottom: '12px', 
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              {currentSentenceIndex + 1} / {currentCard.germanSentences.length}
            </div>
            {!isAnswerRevealed ? (
              <div style={{
                fontSize: '18px',
                color: '#334155',
                lineHeight: '1.5',
                fontWeight: '500'
              }}>
                {languageDirection === "DE→EN" ? getCurrentGermanSentence() : getCurrentEnglishSentence()}
              </div>
            ) : (
              <div>
                <div style={{
                  fontSize: '18px',
                  color: '#334155',
                  lineHeight: '1.5',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {getCurrentGermanSentence()}
                </div>
                <div style={{
                  fontSize: '18px',
                  color: '#64748b',
                  lineHeight: '1.5',
                  fontWeight: '500'
                }}>
                  {getCurrentEnglishSentence()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation and Reveal Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            style={{
              padding: '14px 24px',
              border: currentIndex === 0 ? '2px solid #e2e8f0' : '2px solid #667eea',
              borderRadius: '12px',
              background: currentIndex === 0 ? '#f8fafc' : 'white',
              color: currentIndex === 0 ? '#94a3b8' : '#667eea',
              fontSize: '15px',
              fontWeight: '600',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: currentIndex === 0 ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.15)'
            }}
            onMouseOver={(e) => {
              if (currentIndex !== 0) {
                e.currentTarget.style.background = '#667eea';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.25)';
              }
            }}
            onMouseOut={(e) => {
              if (currentIndex !== 0) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
              }
            }}
          >
            ← Previous
          </button>

          {/* Reveal/Hide Button */}
          <button
            onClick={handleRevealToggle}
            style={{
              padding: '16px 32px',
              border: 'none',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '17px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'translateY(0)',
              minWidth: '180px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }}
          >
            {isAnswerRevealed ? 'Hide Answer' : 'Show Answer'}
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentIndex === currentVocabulary.length - 1}
            style={{
              padding: '14px 24px',
              border: currentIndex === currentVocabulary.length - 1 ? '2px solid #e2e8f0' : '2px solid #667eea',
              borderRadius: '12px',
              background: currentIndex === currentVocabulary.length - 1 ? '#f8fafc' : 'white',
              color: currentIndex === currentVocabulary.length - 1 ? '#94a3b8' : '#667eea',
              fontSize: '15px',
              fontWeight: '600',
              cursor: currentIndex === currentVocabulary.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: currentIndex === currentVocabulary.length - 1 ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.15)'
            }}
            onMouseOver={(e) => {
              if (currentIndex !== currentVocabulary.length - 1) {
                e.currentTarget.style.background = '#667eea';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.25)';
              }
            }}
            onMouseOut={(e) => {
              if (currentIndex !== currentVocabulary.length - 1) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#667eea';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
              }
            }}
          >
            Next →
          </button>
        </div>

        {/* Progress Indicator */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            width: '200px',
            height: '6px',
            background: '#e2e8f0',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '3px',
              width: `${((currentIndex + 1) / currentVocabulary.length) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
          <span style={{
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '600'
          }}>
            {currentIndex + 1} / {currentVocabulary.length}
          </span>
        </div>
      </div>
    </div>
  );
}