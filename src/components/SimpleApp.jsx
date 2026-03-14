import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { proposals } from '../data/proposals';
import { USERS } from '../data/users';

const MEAL_PLAN_COLOR = {
    'PENSIÓN COMPLETA': '#ff4500',
    'DESAYUNO PREMIUM': '#ff4500',
    'MEDIA PENSIÓN': '#ff4500',
    'ALOJAMIENTO': '#ff4500',
    'SIN COMIDAS': '#ff4500',
};

const UserAvatar = ({ name, size = 28 }) => {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const colors = [
        '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#3b82f6', '#ef4444', '#f59e0b',
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;
    const bg = colors[colorIndex];

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: size,
                height: size,
                borderRadius: '50%',
                background: bg,
                color: '#fff',
                fontSize: size * 0.38,
                fontWeight: 700,
                flexShrink: 0,
                border: '2px solid #fff',
            }}
            title={name}
        >
            {initials}
        </span>
    );
};

const ProposalCard = ({ proposal, myVote, allVotes, onVote, loading }) => {
    const voteCount = allVotes.filter((v) => v.destination_id === proposal.id).length;
    const voters = allVotes
        .filter((v) => v.destination_id === proposal.id)
        .map((v) => v.user_name);
    const isMyVote = myVote === proposal.id;

    return (
        <div
            style={{
                background: '#fff',
                borderRadius: 20,
                padding: '20px 20px 16px',
                marginBottom: 16,
                boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                border: isMyVote ? '2px solid #22c55e' : '2px solid transparent',
                transition: 'border-color 0.25s',
            }}
        >
            {/* Header row: name + price */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{proposal.emoji}</span> {proposal.name}
                    </h2>
                    <p
                        style={{
                            margin: '2px 0 0',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            color: MEAL_PLAN_COLOR[proposal.mealPlan] || '#ff4500',
                            textTransform: 'uppercase',
                        }}
                    >
                        {proposal.mealPlan}
                    </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                    <div style={{ color: '#e11d48', fontWeight: 900, fontSize: 20, lineHeight: 1.1 }}>{proposal.price}</div>
                    <div style={{ color: '#888', fontSize: 10, fontWeight: 500, textTransform: 'uppercase' }}>{proposal.priceLabel}</div>
                </div>
            </div>

            {/* Distance & time pill */}
            <div
                style={{
                    display: 'flex',
                    gap: 18,
                    background: '#f3f4f6',
                    borderRadius: 10,
                    padding: '8px 14px',
                    margin: '12px 0',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#374151',
                    width: 'fit-content',
                }}
            >
                <span>🚗 {proposal.distanceKm}</span>
                <span>🕐 {proposal.durationHm}</span>
            </div>

            {/* Features chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {proposal.features.map((feature, i) => (
                    <span
                        key={i}
                        style={{
                            background: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: 20,
                            padding: '5px 12px',
                            fontSize: 12,
                            fontWeight: 500,
                            color: '#374151',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {feature}
                    </span>
                ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#f3f4f6', margin: '4px 0 14px' }} />

            {/* Vote section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                    onClick={() => onVote(proposal.id)}
                    disabled={loading}
                    style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: 12,
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 700,
                        fontSize: 14,
                        background: isMyVote
                            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                            : 'linear-gradient(135deg, #e11d48, #f97316)',
                        color: '#fff',
                        opacity: loading ? 0.6 : 1,
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                    }}
                >
                    {loading ? (
                        '...'
                    ) : isMyVote ? (
                        <>✅ ¡Tu voto!</>
                    ) : (
                        <>🗳️ Votar</>
                    )}
                </button>

                {/* Vote count bubble */}
                <div
                    style={{
                        background: voteCount > 0 ? '#fef2f2' : '#f3f4f6',
                        borderRadius: 12,
                        padding: '8px 14px',
                        textAlign: 'center',
                        minWidth: 52,
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            fontSize: 22,
                            fontWeight: 900,
                            color: voteCount > 0 ? '#e11d48' : '#9ca3af',
                            lineHeight: 1,
                        }}
                    >
                        {voteCount}
                    </div>
                    <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>
                        {voteCount === 1 ? 'voto' : 'votos'}
                    </div>
                </div>
            </div>

            {/* Voters avatars */}
            {voters.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                    <div style={{ display: 'flex', gap: -4 }}>
                        {voters.map((voter) => (
                            <UserAvatar key={voter} name={voter} size={26} />
                        ))}
                    </div>
                    <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
                        {voters.join(', ')}
                    </span>
                </div>
            )}
        </div>
    );
};

const SimpleApp = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [showUserSelect, setShowUserSelect] = useState(true);
    const [myVote, setMyVote] = useState(null);
    const [allVotes, setAllVotes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('escapada_user');
            if (saved) {
                setCurrentUser(saved);
                setShowUserSelect(false);
            }
        }
    }, []);

    useEffect(() => {
        if (currentUser) loadVotes();
    }, [currentUser]);

    const loadVotes = async () => {
        try {
            const { data, error } = await supabase.from('votes').select('*');
            if (error) throw error;
            setAllVotes(data || []);
            const userVote = data?.find((v) => v.user_name === currentUser);
            setMyVote(userVote?.destination_id ?? null);
        } catch (e) {
            console.error('Error loading votes:', e);
        }
    };

    const handleUserSelect = (userName) => {
        setCurrentUser(userName);
        if (typeof window !== 'undefined') localStorage.setItem('escapada_user', userName);
        setShowUserSelect(false);
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') localStorage.removeItem('escapada_user');
        setCurrentUser(null);
        setShowUserSelect(true);
    };

    const handleVote = async (destinationId) => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const existing = allVotes.find((v) => v.user_name === currentUser);
            if (existing) {
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
        } catch (e) {
            console.error('Error votando:', e);
            alert('Error al votar. Intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    /* ─── User select screen ─── */
    if (showUserSelect) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    background: '#0d0d14',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24,
                }}
            >
                <div
                    style={{
                        background: '#1a1a2e',
                        borderRadius: 24,
                        padding: 32,
                        width: '100%',
                        maxWidth: 380,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 28 }}>
                        <div style={{ fontSize: 48, marginBottom: 8 }}>🌿</div>
                        <p style={{ color: '#e11d48', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 4px' }}>
                            Propuestas Oficiales
                        </p>
                        <h1 style={{ color: '#fff', fontSize: 40, fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.03em' }}>
                            LAS 11
                        </h1>
                        <p style={{ color: '#9ca3af', fontSize: 14, margin: 0, fontStyle: 'italic' }}>
                            Escapada Abril 2026 • Mendoza Vol. 2
                        </p>
                        <div style={{ width: 48, height: 4, background: '#e11d48', borderRadius: 2, margin: '14px auto 0' }} />
                    </div>
                    <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', marginBottom: 16 }}>
                        ¿Quién sos?
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {USERS.map((user) => (
                            <button
                                key={user}
                                onClick={() => handleUserSelect(user)}
                                style={{
                                    background: 'linear-gradient(135deg, #e11d48, #f97316)',
                                    border: 'none',
                                    borderRadius: 14,
                                    padding: '14px 20px',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                }}
                            >
                                <UserAvatar name={user} size={30} />
                                {user}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /* ─── Main list screen ─── */
    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
            {/* Dark header */}
            <div
                style={{
                    background: '#0d0d14',
                    padding: '28px 20px 32px',
                    textAlign: 'center',
                    position: 'relative',
                }}
            >
                <p
                    style={{
                        color: '#e11d48',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        margin: '0 0 4px',
                    }}
                >
                    Propuestas Oficiales
                </p>
                <h1
                    style={{
                        color: '#fff',
                        fontSize: 48,
                        fontWeight: 900,
                        margin: '0 0 4px',
                        letterSpacing: '-0.03em',
                        fontStyle: 'italic',
                    }}
                >
                    LAS {USERS.length}
                </h1>
                <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 14px', fontStyle: 'italic' }}>
                    Escapada Abril 2026 • Mendoza Vol. 2
                </p>
                <div style={{ width: 48, height: 4, background: '#e11d48', borderRadius: 2, margin: '0 auto 16px' }} />

                {/* User badge + logout */}
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: 40,
                        padding: '6px 14px',
                    }}
                >
                    <UserAvatar name={currentUser} size={24} />
                    <span style={{ color: '#e5e7eb', fontSize: 13, fontWeight: 600 }}>{currentUser}</span>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#9ca3af',
                            cursor: 'pointer',
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '2px 6px 2px 0',
                            textDecoration: 'underline',
                        }}
                    >
                        salir
                    </button>
                </div>

                {/* My vote badge */}
                {myVote !== null && (
                    <div
                        style={{
                            marginTop: 10,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            background: 'rgba(34,197,94,0.15)',
                            border: '1px solid rgba(34,197,94,0.3)',
                            borderRadius: 40,
                            padding: '5px 14px',
                            fontSize: 12,
                            color: '#86efac',
                            fontWeight: 600,
                        }}
                    >
                        ✅ Votaste:{' '}
                        <strong style={{ color: '#fff' }}>
                            {proposals.find((p) => p.id === myVote)?.name}
                        </strong>
                    </div>
                )}
            </div>

            {/* Summary bar */}
            <div
                style={{
                    background: '#fff',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '10px 20px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 24,
                    fontSize: 13,
                    color: '#6b7280',
                    fontWeight: 500,
                }}
            >
                <span>🗳️ {allVotes.length} de {USERS.length} votaron</span>
                <span>📋 {proposals.length} propuestas</span>
            </div>

            {/* Cards list */}
            <div style={{ maxWidth: 520, margin: '0 auto', padding: '20px 16px 40px' }}>
                {proposals.map((proposal) => (
                    <ProposalCard
                        key={proposal.id}
                        proposal={proposal}
                        myVote={myVote}
                        allVotes={allVotes}
                        onVote={handleVote}
                        loading={loading}
                    />
                ))}
            </div>
        </div>
    );
};

export default SimpleApp;
