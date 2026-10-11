import { createContext, useContext } from 'react';

/**
 * Provided by FeedbackProvider:
 *   toast(message, { tone: 'success' | 'error' }) — short confirmation at the bottom of the screen
 *   confirm({ title, message, confirmLabel }) — styled "are you sure?" dialog, resolves to true / false
 */
export const FeedbackContext = createContext(null);

export const useFeedback = () => useContext(FeedbackContext);
