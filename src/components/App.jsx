import React, { useState, useEffect } from 'react';
import { Wine, MapPin, Clock, Car, ChevronRight, ChevronLeft, Star, CircleCheck as CheckCircle, Vote, ChartBar as BarChart3, Users, CircleUser as UserCircle2, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

const USERS = ['Agostina', 'Alejandra', 'Marie', 'Andrea'];

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserSelect, setShowUserSelect] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [myVote, setMyVote] = useState(null);
  const [allVotes, setAllVotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('escapada_user');
      if (savedUser) {
        setCurrentUser(savedUser);
        setShowUserSelect(false);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadVotes();
    }
  }, [currentUser]);

  const loadVotes = async () => {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('*');

      if (error) throw error;

      setAllVotes(data || []);
      const userVote = data?.find(v => v.user_name === currentUser);
      setMyVote(userVote?.destination_id ?? null);
    } catch (error) {
      console.error('Error loading votes:', error);
    }
  };

  const handleUserSelect = (userName) => {
    setCurrentUser(userName);
    if (typeof window !== 'undefined') {
      localStorage.setItem('escapada_user', userName);
    }
    setShowUserSelect(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('escapada_user');
    }
    setCurrentUser(null);
    setShowUserSelect(true);
    setActiveSlide(0);
  };

  const proposals = [
    {
      id: 0,
      name: 'Valle de Uco',
      region: 'Mendoza',
      description: 'Viñedos de altura con vistas a la Cordillera de los Andes',
      highlights: ['Bodegas boutique', 'Gastronomía andina', 'Trekking en montaña'],
      duration: '3 días / 2 noches',
      distance: '1100 km',
      bestTime: 'Marzo - Mayo',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    },
    {
      id: 1,
      name: 'Cafayate',
      region: 'Salta',
      description: 'Capital del vino argentino con bodegas de altura y paisajes únicos',
      highlights: ['Torrontés premium', 'Quebrada de las Conchas', 'Arquitectura colonial'],
      duration: '4 días / 3 noches',
      distance: '1600 km',
      bestTime: 'Marzo - Junio',
      image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg'
    },
    {
      id: 2,
      name: 'San Rafael',
      region: 'Mendoza',
      description: 'Oasis vitivinícola con aventuras en Cañón del Atuel',
      highlights: ['Rafting y aventura', 'Bodegas tradicionales', 'Dique y lagos'],
      duration: '3 días / 2 noches',
      distance: '800 km',
      bestTime: 'Marzo - Abril',
      image: 'https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg'
    },
    {
      id: 3,
      name: 'Colonia Caroya',
      region: 'Córdoba',
      description: 'Tradición italiana con vinos artesanales y gastronomía única',
      highlights: ['Festival del salame', 'Bodegas familiares', 'Cultura italiana'],
      duration: '2 días / 1 noche',
      distance: '150 km',
      bestTime: 'Todo el año',
      image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg'
    },
    {
      id: 4,
      name: 'Villa General Belgrano',
      region: 'Córdoba',
      description: 'Pueblo alemán con cervecerías artesanales y ambiente alpino',
      highlights: ['Oktoberfest', 'Cerveza artesanal', 'Arquitectura alemana'],
      duration: '2 días / 1 noche',
      distance: '100 km',
      bestTime: 'Todo el año',
      image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg'
    },
    {
      id: 5,
      name: 'Luján de Cuyo',
      region: 'Mendoza',
      description: 'Cuna del Malbec argentino con bodegas de renombre mundial',
      highlights: ['Malbec de excelencia', 'Bodegas icónicas', 'Alta gastronomía'],
      duration: '3 días / 2 noches',
      distance: '1000 km',
      bestTime: 'Marzo - Mayo',
      image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg'
    }
  ];

  const handleVote = async (destinationId) => {
    if (!currentUser) return;
    setLoading(true);

    try {
      const existingVote = allVotes.find(v => v.user_name === currentUser);

      if (existingVote) {
        const { error } = await supabase
          .from('votes')
          .update({ destination_id: destinationId, updated_at: new Date().toISOString() })
          .eq('user_name', currentUser);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('votes')
          .insert([{ user_name: currentUser, destination_id: destinationId }]);

        if (error) throw error;
      }

      setMyVote(destinationId);
      await loadVotes();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error al votar. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === proposals.length ? prev : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const getVoteCount = (destinationId) => {
    return allVotes.filter(v => v.destination_id === destinationId).length;
  };

  const getVoters = (destinationId) => {
    return allVotes
      .filter(v => v.destination_id === destinationId)
      .map(v => v.user_name);
  };

  const shareVote = () => {
    if (myVote === null) return;
    const destination = proposals.find(p => p.id === myVote);
    const text = `¡Voté por ${destination.name}, ${destination.region} para nuestra Escapada 2026! 🍷✨`;
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (showUserSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Wine className="w-16 h-16 mx-auto text-purple-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Escapada 2026</h1>
            <p className="text-gray-600">Seleccioná tu usuario para continuar</p>
          </div>

          <div className="space-y-3">
            {USERS.map((user) => (
              <button
                key={user}
                onClick={() => handleUserSelect(user)}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <UserCircle2 className="w-5 h-5" />
                {user}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isResultsSlide = activeSlide === proposals.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Wine className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Escapada 2026</h1>
                  <p className="text-purple-100 text-sm flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {currentUser}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {myVote !== null && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">
                    Tu voto: <strong>{proposals.find(p => p.id === myVote)?.name}</strong>
                  </span>
                </div>
                <button
                  onClick={shareVote}
                  className="text-xs bg-white/30 hover:bg-white/40 px-3 py-1 rounded-full transition-colors"
                >
                  Compartir
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
              <button
                onClick={prevSlide}
                disabled={activeSlide === 0}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex gap-2">
                {[...proposals, { id: 'results' }].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeSlide === index
                        ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                disabled={activeSlide === proposals.length}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {isResultsSlide ? (
                <div className="p-6 min-h-[500px]">
                  <div className="text-center mb-8">
                    <BarChart3 className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Resultados</h2>
                    <p className="text-gray-600">Votos totales: {allVotes.length}/{USERS.length}</p>
                  </div>

                  <div className="space-y-4">
                    {proposals
                      .map(proposal => ({
                        ...proposal,
                        votes: getVoteCount(proposal.id),
                        voters: getVoters(proposal.id)
                      }))
                      .sort((a, b) => b.votes - a.votes)
                      .map((proposal, index) => (
                        <div
                          key={proposal.id}
                          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-100"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {index === 0 && proposal.votes > 0 && (
                                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                )}
                                <h3 className="font-bold text-lg text-gray-800">
                                  {proposal.name}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-600">{proposal.region}</p>
                            </div>
                            <div className="text-center">
                              <div className="text-3xl font-bold text-purple-600">
                                {proposal.votes}
                              </div>
                              <div className="text-xs text-gray-500">
                                {proposal.votes === 1 ? 'voto' : 'votos'}
                              </div>
                            </div>
                          </div>

                          {proposal.voters.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {proposal.voters.map(voter => (
                                <span
                                  key={voter}
                                  className="text-xs bg-white px-3 py-1 rounded-full text-gray-700 font-medium"
                                >
                                  {voter}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                              style={{
                                width: `${allVotes.length > 0 ? (proposal.votes / allVotes.length) * 100 : 0}%`
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  {proposals[activeSlide] && (
                    <div className="space-y-6">
                      <div className="relative h-64 rounded-xl overflow-hidden">
                        <img
                          src={proposals[activeSlide].image}
                          alt={proposals[activeSlide].name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h2 className="text-3xl font-bold mb-1">
                            {proposals[activeSlide].name}
                          </h2>
                          <p className="text-lg flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {proposals[activeSlide].region}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 text-lg">
                        {proposals[activeSlide].description}
                      </p>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <Clock className="w-6 h-6 mx-auto text-purple-600 mb-1" />
                          <p className="text-xs text-gray-600">Duración</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {proposals[activeSlide].duration}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-pink-50 rounded-lg">
                          <Car className="w-6 h-6 mx-auto text-pink-600 mb-1" />
                          <p className="text-xs text-gray-600">Distancia</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {proposals[activeSlide].distance}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <Star className="w-6 h-6 mx-auto text-orange-600 mb-1" />
                          <p className="text-xs text-gray-600">Mejor época</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {proposals[activeSlide].bestTime}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Star className="w-5 h-5 text-purple-600" />
                          Highlights
                        </h3>
                        <ul className="space-y-2">
                          {proposals[activeSlide].highlights.map((highlight, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-gray-700"
                            >
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => handleVote(proposals[activeSlide].id)}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                          myVote === proposals[activeSlide].id
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {loading ? (
                          'Votando...'
                        ) : myVote === proposals[activeSlide].id ? (
                          <>
                            <CheckCircle className="w-6 h-6" />
                            ¡Votaste por este destino!
                          </>
                        ) : (
                          <>
                            <Vote className="w-6 h-6" />
                            Votar por este destino
                          </>
                        )}
                      </button>

                      <div className="text-center text-sm text-gray-500">
                        {getVoteCount(proposals[activeSlide].id)} {getVoteCount(proposals[activeSlide].id) === 1 ? 'persona votó' : 'personas votaron'} por este destino
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
