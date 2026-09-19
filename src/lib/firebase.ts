import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot, increment } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Sport, QuizQuestion, ProductItem, SponsorInquiry, AnalyticsStats, CommunityPost, PostComment, CommunityPostType } from '../types';
import { DEFAULT_SPORTS, DEFAULT_QUIZ_QUESTIONS, DEFAULT_PRODUCTS, DEFAULT_INQUIRIES, DEFAULT_ANALYTICS } from '../data/defaultData';
import { DEFAULT_POSTS, DEFAULT_COMMENTS } from '../data/defaultCommunityData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn('Firestore Warning: ', JSON.stringify(errInfo));
}

// Test connection on boot as mandated by Firebase skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, fallback mode active.');
    }
    return false;
  }
}

// Google Sign-in with Popup
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-in error:', error);
    throw error;
  }
}

// Sign out
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Local storage cache keys for instant offline/speed reliability
const STORAGE_KEYS = {
  SPORTS: 'unmyeong_sports_v1',
  QUESTIONS: 'unmyeong_questions_v1',
  PRODUCTS: 'unmyeong_products_v1',
  INQUIRIES: 'unmyeong_inquiries_v1',
  ANALYTICS: 'unmyeong_analytics_v1',
  POSTS: 'unmyeong_posts_v1',
  COMMENTS: 'unmyeong_comments_v1',
};

// Seed initial data to Firestore if not already present, or return cached/defaults
export async function getSportsData(): Promise<Sport[]> {
  try {
    const snap = await getDocs(collection(db, 'sports'));
    if (!snap.empty) {
      const items = snap.docs.map(d => d.data() as Sport);
      localStorage.setItem(STORAGE_KEYS.SPORTS, JSON.stringify(items));
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'sports');
  }

  // Check local cache
  const local = localStorage.getItem(STORAGE_KEYS.SPORTS);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }
  return DEFAULT_SPORTS;
}

export async function saveSport(sport: Sport): Promise<void> {
  try {
    await setDoc(doc(db, 'sports', sport.id), sport);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `sports/${sport.id}`);
  }
  // Also update local cache
  const current = await getSportsData();
  const index = current.findIndex(s => s.id === sport.id);
  let updated: Sport[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = sport;
  } else {
    updated = [...current, sport];
  }
  localStorage.setItem(STORAGE_KEYS.SPORTS, JSON.stringify(updated));
}

export async function deleteSport(sportId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'sports', sportId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `sports/${sportId}`);
  }
  const current = await getSportsData();
  const updated = current.filter(s => s.id !== sportId);
  localStorage.setItem(STORAGE_KEYS.SPORTS, JSON.stringify(updated));
}

export async function getQuestionsData(): Promise<QuizQuestion[]> {
  try {
    const snap = await getDocs(collection(db, 'quizQuestions'));
    if (!snap.empty) {
      const items = snap.docs.map(d => d.data() as QuizQuestion).sort((a, b) => a.order - b.order);
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(items));
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'quizQuestions');
  }

  const local = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }
  return DEFAULT_QUIZ_QUESTIONS;
}

export async function saveQuestion(question: QuizQuestion): Promise<void> {
  try {
    await setDoc(doc(db, 'quizQuestions', question.id), question);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `quizQuestions/${question.id}`);
  }
  const current = await getQuestionsData();
  const index = current.findIndex(q => q.id === question.id);
  const updated = index >= 0 ? current.map(q => q.id === question.id ? question : q) : [...current, question];
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(updated));
}

export async function getProductsData(): Promise<ProductItem[]> {
  try {
    const snap = await getDocs(collection(db, 'products'));
    if (!snap.empty) {
      const items = snap.docs.map(d => d.data() as ProductItem);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(items));
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'products');
  }

  const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }
  return DEFAULT_PRODUCTS;
}

export async function saveProduct(product: ProductItem): Promise<void> {
  try {
    await setDoc(doc(db, 'products', product.id), product);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
  }
  const current = await getProductsData();
  const index = current.findIndex(p => p.id === product.id);
  const updated = index >= 0 ? current.map(p => p.id === product.id ? product : p) : [...current, product];
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
  }
  const current = await getProductsData();
  const updated = current.filter(p => p.id !== productId);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
}

export async function recordProductClick(productId: string): Promise<void> {
  try {
    const ref = doc(db, 'products', productId);
    await updateDoc(ref, { clicks: increment(1) });
  } catch (err) {
    // Non-critical, handle silently
  }
  // Increment local
  const current = await getProductsData();
  const updated = current.map(p => p.id === productId ? { ...p, clicks: (p.clicks || 0) + 1 } : p);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
}

export async function getInquiries(): Promise<SponsorInquiry[]> {
  try {
    const snap = await getDocs(collection(db, 'sponsorInquiries'));
    if (!snap.empty) {
      const items = snap.docs.map(d => d.data() as SponsorInquiry);
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'sponsorInquiries');
  }
  const local = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }
  return DEFAULT_INQUIRIES;
}

export async function submitInquiry(inquiry: Omit<SponsorInquiry, 'id' | 'createdAt' | 'status'>): Promise<SponsorInquiry> {
  const newInquiry: SponsorInquiry = {
    ...inquiry,
    id: `inq_${Date.now()}`,
    status: '접수완료',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'sponsorInquiries', newInquiry.id), newInquiry);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `sponsorInquiries/${newInquiry.id}`);
  }

  const current = await getInquiries();
  const updated = [newInquiry, ...current];
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
  return newInquiry;
}

export async function updateInquiryStatus(id: string, status: SponsorInquiry['status']): Promise<void> {
  try {
    await updateDoc(doc(db, 'sponsorInquiries', id), { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `sponsorInquiries/${id}`);
  }
  const current = await getInquiries();
  const updated = current.map(i => i.id === id ? { ...i, status } : i);
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
}

export async function getAnalytics(): Promise<AnalyticsStats> {
  try {
    const snap = await getDocs(collection(db, 'analytics'));
    if (!snap.empty) {
      return snap.docs[0].data() as AnalyticsStats;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'analytics');
  }
  const local = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }
  return DEFAULT_ANALYTICS;
}

export async function recordQuizCompletion(topSportId: string): Promise<void> {
  try {
    const stats = await getAnalytics();
    const updatedStats: AnalyticsStats = {
      ...stats,
      totalTests: stats.totalTests + 1,
      sportRecommendations: {
        ...stats.sportRecommendations,
        [topSportId]: (stats.sportRecommendations[topSportId] || 0) + 1,
      },
    };
    await setDoc(doc(db, 'analytics', 'general'), updatedStats);
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(updatedStats));
  } catch (err) {
    // Non-critical
  }
}

// -------------------------------------------------------------
// Community Posts & Mate & Review Functions
// -------------------------------------------------------------

export async function getCommunityPosts(
  typeFilter?: string,
  sportIdFilter?: string
): Promise<CommunityPost[]> {
  try {
    const snap = await getDocs(collection(db, 'communityPosts'));
    if (!snap.empty) {
      let items = snap.docs.map((d) => d.data() as CommunityPost);
      // Sort: pinned/notice first, then newest createdAt
      items.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(items));

      if (typeFilter && typeFilter !== 'all') {
        items = items.filter((p) => p.type === typeFilter);
      }
      if (sportIdFilter && sportIdFilter !== 'all') {
        items = items.filter((p) => p.sportId === sportIdFilter);
      }
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'communityPosts');
  }

  // Fallback to local storage or defaults
  const local = localStorage.getItem(STORAGE_KEYS.POSTS);
  let posts = DEFAULT_POSTS;
  if (local) {
    try {
      posts = JSON.parse(local);
    } catch {
      posts = DEFAULT_POSTS;
    }
  } else {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(DEFAULT_POSTS));
  }

  // Filter
  let filtered = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (typeFilter && typeFilter !== 'all') {
    filtered = filtered.filter((p) => p.type === typeFilter);
  }
  if (sportIdFilter && sportIdFilter !== 'all') {
    filtered = filtered.filter((p) => p.sportId === sportIdFilter);
  }
  return filtered;
}

export async function createCommunityPost(
  postData: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'commentsCount'>
): Promise<CommunityPost> {
  const newPost: CommunityPost = {
    ...postData,
    id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    likes: 0,
    likedByUserIds: [],
    commentsCount: 0,
  };

  try {
    await setDoc(doc(db, 'communityPosts', newPost.id), newPost);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `communityPosts/${newPost.id}`);
  }

  // Update local cache
  const allPosts = await getCommunityPosts('all', 'all');
  const updated = [newPost, ...allPosts];
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));

  return newPost;
}

export async function saveCommunityPost(post: CommunityPost): Promise<void> {
  try {
    await setDoc(doc(db, 'communityPosts', post.id), post);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `communityPosts/${post.id}`);
  }

  const allPosts = await getCommunityPosts('all', 'all');
  const updated = allPosts.map((p) => (p.id === post.id ? post : p));
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
}

export async function deleteCommunityPost(postId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'communityPosts', postId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `communityPosts/${postId}`);
  }

  const allPosts = await getCommunityPosts('all', 'all');
  const updated = allPosts.filter((p) => p.id !== postId);
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
}

export async function toggleLikePost(postId: string, userId: string = 'guest'): Promise<{ liked: boolean; likes: number }> {
  const allPosts = await getCommunityPosts('all', 'all');
  const target = allPosts.find((p) => p.id === postId);
  if (!target) return { liked: false, likes: 0 };

  const likedList = target.likedByUserIds || [];
  const alreadyLiked = likedList.includes(userId);
  const newLikedList = alreadyLiked ? likedList.filter((u) => u !== userId) : [...likedList, userId];
  const newLikes = alreadyLiked ? Math.max(0, (target.likes || 1) - 1) : (target.likes || 0) + 1;

  const updatedPost: CommunityPost = {
    ...target,
    likes: newLikes,
    likedByUserIds: newLikedList,
  };

  try {
    await updateDoc(doc(db, 'communityPosts', postId), {
      likes: newLikes,
      likedByUserIds: newLikedList,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `communityPosts/${postId}`);
  }

  const updated = allPosts.map((p) => (p.id === postId ? updatedPost : p));
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));

  return { liked: !alreadyLiked, likes: newLikes };
}

export async function updatePostStatus(postId: string, status: 'recruiting' | 'completed'): Promise<void> {
  try {
    await updateDoc(doc(db, 'communityPosts', postId), { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `communityPosts/${postId}`);
  }

  const allPosts = await getCommunityPosts('all', 'all');
  const updated = allPosts.map((p) => (p.id === postId ? { ...p, status } : p));
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
}

export async function togglePinPost(postId: string): Promise<boolean> {
  const allPosts = await getCommunityPosts('all', 'all');
  const target = allPosts.find((p) => p.id === postId);
  if (!target) return false;

  const newPinned = !target.isPinned;
  try {
    await updateDoc(doc(db, 'communityPosts', postId), { isPinned: newPinned });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `communityPosts/${postId}`);
  }

  const updated = allPosts.map((p) => (p.id === postId ? { ...p, isPinned: newPinned } : p));
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
  return newPinned;
}

// -------------------------------------------------------------
// Comments Functions
// -------------------------------------------------------------

export async function getCommentsForPost(postId: string): Promise<PostComment[]> {
  try {
    const snap = await getDocs(collection(db, 'communityPosts', postId, 'comments'));
    if (!snap.empty) {
      const items = snap.docs.map((d) => d.data() as PostComment);
      items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `communityPosts/${postId}/comments`);
  }

  // Fallback to local storage or defaults
  const local = localStorage.getItem(`${STORAGE_KEYS.COMMENTS}_${postId}`);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // ignore
    }
  }

  return DEFAULT_COMMENTS[postId] || [];
}

export async function addCommentToPost(
  commentData: Omit<PostComment, 'id' | 'createdAt' | 'likes'>
): Promise<PostComment> {
  const newComment: PostComment = {
    ...commentData,
    id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    likes: 0,
  };

  try {
    await setDoc(doc(db, 'communityPosts', newComment.postId, 'comments', newComment.id), newComment);
    await updateDoc(doc(db, 'communityPosts', newComment.postId), {
      commentsCount: increment(1),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `communityPosts/${newComment.postId}/comments/${newComment.id}`);
  }

  // Sync comments local storage
  const currentComments = await getCommentsForPost(newComment.postId);
  const updatedComments = [...currentComments, newComment];
  localStorage.setItem(`${STORAGE_KEYS.COMMENTS}_${newComment.postId}`, JSON.stringify(updatedComments));

  // Update parent post commentsCount in local storage
  const allPosts = await getCommunityPosts('all', 'all');
  const updatedPosts = allPosts.map((p) =>
    p.id === newComment.postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p
  );
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts));

  return newComment;
}

export async function deleteCommentFromPost(postId: string, commentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'communityPosts', postId, 'comments', commentId));
    await updateDoc(doc(db, 'communityPosts', postId), {
      commentsCount: increment(-1),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `communityPosts/${postId}/comments/${commentId}`);
  }

  const currentComments = await getCommentsForPost(postId);
  const updatedComments = currentComments.filter((c) => c.id !== commentId);
  localStorage.setItem(`${STORAGE_KEYS.COMMENTS}_${postId}`, JSON.stringify(updatedComments));

  const allPosts = await getCommunityPosts('all', 'all');
  const updatedPosts = allPosts.map((p) =>
    p.id === postId ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 1) - 1) } : p
  );
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts));
}

export async function toggleLikeComment(postId: string, commentId: string): Promise<number> {
  const currentComments = await getCommentsForPost(postId);
  const target = currentComments.find((c) => c.id === commentId);
  if (!target) return 0;

  const newLikes = (target.likes || 0) + 1;
  try {
    await updateDoc(doc(db, 'communityPosts', postId, 'comments', commentId), {
      likes: increment(1),
    });
  } catch (err) {
    // ignore
  }

  const updatedComments = currentComments.map((c) => (c.id === commentId ? { ...c, likes: newLikes } : c));
  localStorage.setItem(`${STORAGE_KEYS.COMMENTS}_${postId}`, JSON.stringify(updatedComments));
  return newLikes;
}

