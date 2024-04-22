import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';

function SponsorPointRatio() {
    const [ratio, setRatio] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCurrentRatio();
    }, []);

    const fetchCurrentRatio = async () => {
        setLoading(true);
        // Fetch the current ratio from API
        //const data = await API.get('apiName', '/currentSponsorRatio');
        setRatio(data.ratio);
        setLoading(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        // Update the ratio in API
        //await API.put('apiName', '/updateSponsorRatio', { body: { ratio } });
        setLoading(false);
        alert('Ratio updated successfully!');
    };

    return (
        <div>
            <h2>Update Point Ratio</h2>
            {loading ? <p>Loading...</p> : (
                <form onSubmit={handleSubmit}>
                    <label>
                        Point Ratio:
                        <input
                            type="text"
                            value={ratio}
                            onChange={e => setRatio(e.target.value)}
                        />
                    </label>
                    <button type="submit">Update Ratio</button>
                </form>
            )}
        </div>
    );
}

export default SponsorPointRatio;
