import React, { useEffect } from 'react';
import { toast } from '../../../utils/toast';
import { confirmDialog } from '../../../utils/confirm';
import { useApi } from '../../../utils/useApi';
import { useLoggerData } from './hooks/useLoggerData';
import LoggerHeader from './components/LoggerHeader';
import LogStatCards from './components/LogStatCards';
import LogFilterBar from './components/LogFilterBar';
import LogEndpointSidebar from './components/LogEndpointSidebar';
import LogTimeline from './components/LogTimeline';

const Logger = () => {
    const {
        rawLogs,
        loadLogs,
        clearLogs,
        activeKey,
        setActiveKey,
        search,
        setSearch,
        selectedMethod,
        setSelectedMethod,
        filteredGroupedEndpoints,
        displayedLogs,
        stats,
        maxLogLatency,
    } = useLoggerData();

    const { request, loading: testLoading } = useApi();

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    const handleClearLogs = async () => {
        const willClear = await confirmDialog({
            title: 'Reset API Logs?',
            text: 'This will purge all locally saved diagnostic and telemetry records.',
            icon: 'warning',
            buttons: ['Cancel', 'Purge'],
            dangerMode: true,
        });

        if (willClear) {
            clearLogs();
            toast.success('API logs cleared successfully');
        }
    };

    const handleExportJSON = () => {
        try {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(rawLogs, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute('href', dataStr);
            downloadAnchor.setAttribute('download', `accusoft_api_logs_${Date.now()}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            toast.success('Telemetry exported to JSON');
        } catch (e) {
            toast.error('Failed to export logs');
        }
    };

    const handleRunTestCall = async () => {
        try {
            await request({ url: 'userdata', method: 'GET' });
            loadLogs();
            toast.success('Test call executed & logged');
        } catch (e) {
            loadLogs();
        }
    };

    return (
        <div className="w-full p-2 md:p-6 space-y-6 text-gray-800 dark:text-gray-100 min-h-[calc(100vh-var(--navheight))] animate-in fade-in duration-200">
            <LoggerHeader
                onRunTestCall={handleRunTestCall}
                onLoadLogs={loadLogs}
                onExportJSON={handleExportJSON}
                onClearLogs={handleClearLogs}
                testLoading={testLoading}
            />

            <LogStatCards stats={stats} />

            <LogFilterBar
                search={search}
                setSearch={setSearch}
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <LogEndpointSidebar
                    filteredGroupedEndpoints={filteredGroupedEndpoints}
                    activeKey={activeKey}
                    setActiveKey={setActiveKey}
                    totalLogsCount={rawLogs.length}
                />

                <LogTimeline
                    displayedLogs={displayedLogs}
                    activeKey={activeKey}
                    maxLogLatency={maxLogLatency}
                    onRunTestCall={handleRunTestCall}
                    testLoading={testLoading}
                />
            </div>
        </div>
    );
};

export default Logger;
